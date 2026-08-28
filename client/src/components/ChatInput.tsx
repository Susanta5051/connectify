import {  useEffect, useRef, useState, type ChangeEvent } from "react";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFileOutlined";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TextareaAutosize from "@mui/material/TextareaAutosize";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import ClearIcon from '@mui/icons-material/Clear';
import { backendUrl } from "../App.tsx";
import axios from "axios";
import { toast } from "react-toastify";
// import {useSocket} from "../contexts/useSocket.ts"
import { socket } from "@/contexts/socket.ts";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Spinner } from "./ui/spinner";
axios.defaults.withCredentials = true;

export type FormDataType = {
  text: string;
  file: File | null;
  image: File | null;
};

// 5MB limit configurations
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ChatInput = () => {
  const [formData, setFormData] = useState<FormDataType>({
    text: "",
    file: null,
    image: null,
  });
  const [loading , setLoading] = useState<boolean>(false);
  const [imgUrl , setImgUrl] = useState("")
  const [fileUrl , setFileUrl] = useState("")
const typingTimeoutRef = useRef<number | null>(null);

  

  const user = useSelector((state:RootState)=>state.user)
  const selectedContact = useSelector((state:RootState)=>state.selectedContact)

  useEffect(()=>{
  },[selectedContact])
    
  if(!selectedContact || !user){
    return
  }
    
  // const { onlineUsers, messages, sendMessage } = useSocket(user?._id.toString());
  
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, text: value }));

    if (value.trim().length > 0) {
      socket.emit("typing", { receiverId: selectedContact._id, isTyping: true });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("typing", { receiverId: selectedContact._id, isTyping: false });
      }, 1500);
    } else {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.emit("typing", { receiverId: selectedContact._id, isTyping: false });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    const selectedFile = files[0];

    if (name === "image") {
      if (selectedFile.size > MAX_IMAGE_SIZE) {
        alert("Media is too large! Maximum limit is 5MB.");
        e.target.value = "";
        return;
      }
      const url = URL.createObjectURL(selectedFile)
      setImgUrl(url)
      setFormData((prev) => ({ ...prev, image: selectedFile }));
    } else if (name === "file") {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("Document is too large! Maximum limit is 5MB.");
        e.target.value = ""; 
        return;
      }
      const url = URL.createObjectURL(selectedFile)
      setFileUrl(url)
      setFormData((prev) => ({ ...prev, file: selectedFile }));
    }
  };

  const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(loading)return;
    setLoading(true)
    try{
      if(!(formData.file || formData.text || formData.image)){
        return
      }
      
      const data = new FormData();
      if(formData.image)
        data.append("image",formData.image)
      if(formData.file)
        data.append("file",formData.file)
      if(formData.text)
        data.append("text",JSON.stringify(formData.text))
      if(selectedContact?.email)
      data.append("receiverEmail" , JSON.stringify(selectedContact?.email))

      // sendMessage(selectedContact?._id.toString(), formData);
      const sendMessage = () => {
        if (!formData.text) return;
        let receiverId = selectedContact._id.toString();
        if(!receiverId)return
        socket.emit("sendMessage", {
          receiverId,
          formData: {
            text: formData.text,
            file: formData.file,
            image: formData.image,
          },
        });
        // setMessage("");
      };
      sendMessage();
      socket.emit("typing",{receiverId : selectedContact._id , isTyping:false})
      const response = await axios.post(`${backendUrl}/message/create` , data, {headers :{"Content-Type" : "multipart/form-data" }} )
      setFormData({ text: "", file: null, image: null });
      
    }catch(error:any){
      console.log(error)
      toast.error(error.response?.data?.message)
    }finally{
      setLoading(false)
    }    
  };

  

  return (
    <div className="sticky w-full text-black text-[1rem] md:text-[1.25rem] z-20">
      <div className="absolute bottom-0 w-full bg-blue-100 rounded m-0.5 ">
        <div className="flex flex-row justify-between gap-1 h-full">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-row justify-between gap-1 h-full w-full"
          >
            <div className="w-full flex-1 relative">
              {
                formData.file && 
                <div className="flex py-0.5 rounded-4xl">
                  <div className="relative">
                    <PictureAsPdfIcon className="text-red-600 absolute"/>
                  </div> 
                  <p className="inline bg-slate-500 pl-7 pr-10  ">{formData.file.name}</p>
                  <div className="relative right-3 text-3xl cursor-pointer " onClick={()=>setFormData((data)=>({...data , "file":null}))}>
                    <ClearIcon className="absolute -right-2 -top-0.5 " fontSize="inherit" />
                  </div>
                </div>
              }
              {
                formData.image && 
                <div className="flex">
                  <img src={imgUrl} alt="selected" className="h-20 rounded-2xl" />
                  <div className="relative hover:text-3xl cursor-pointer " onClick={()=>setFormData((data)=>({...data , "image":null}))}>
                    <ClearIcon className="absolute -right-2 -top-0.5 " fontSize="inherit" />
                  </div>
                </div>
              }
              <TextareaAutosize
                name="text"
                onChange={handleTextChange}
                value={formData.text}
                className="w-full bg-blue-100/20 rounded p-1 bottom-0 mr-9 px-2 overflow-x-auto outline-none resize-none"
                placeholder="Type a message..."
              />
            </div>

            <div className="flex flex-row text-blue-800 items-end bg-gray-400">
              <input
                id="image"
                name="image"
                className="hidden"
                type="file"
                accept="image/*, video/*"
                onChange={handleFileChange}
              />
              <label htmlFor="image" className="p-1.5 cursor-pointer">
                <PermMediaIcon />
              </label>

              <input
                id="file"
                name="file"
                className="hidden"
                type="file"
                accept=".doc,.docx,.xls,.xlsx,.pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="file" className="p-1.5 cursor-pointer">
                <AttachFileIcon />
              </label>

              <button
                type="submit"
                className="p-1.5 cursor-pointer border-none bg-transparent text-blue-800"
              >
                {
                  loading ?
                  <Spinner className="size-7 "/>
                  :
                  <SendIcon /> 
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
