import type{ Request, Response } from "express";
import User from "../models/User.model.ts";
import Message from "../models/Message.model.ts";
// import {cloudinary }from "../middlewares/Cloudinary.ts";
import {io , userSocketMap} from '../lib/socket.ts'
import uploadImage from '../middlewares/ImageUpload.ts'

export const createMessage = async (req: Request, res: Response) => {
  try {

    // console.dir(req.body)
    const { text, receiverEmail }= req.body;
      if(!req.user || !receiverEmail){
      return 
    }
    const id = req.user?._id;
    if(!id){
      return res.status(401).json({status: false , message : "UnAuthorized!"})
    }

    const receiver = await User.findOne({ email : JSON.parse(receiverEmail) }).select(
      "-password"
    );

    if (!receiver) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver does not exists!" });
    }

    if(id.toString() === receiver._id.toString()){
      return res
        .status(404)
        .json({ success: false, message: "Trying to message yourself !"});
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const image = files?.['image']?.[0];
    const file = files?.['file']?.[0];

    let formData = {text:"",image:"",file:""};
    if (text) {
      formData.text=JSON.parse(text);
    }


    if (image) {
      const url = await uploadImage(image)  
      if(url)    
      formData.image = url;
    }


    if (file) {
      const url = await uploadImage(file)
      if(url)      
      formData.file = url;
    }
    
    

    const haveSenderContact = receiver.contacts.some((c)=>c.contact?.toString() === id.toString());
    const haveReceiverContact = req.user?.contacts?.some((c:any)=>c?.contact?.toString() === receiver._id.toString());

    if(!haveReceiverContact){
      await User.findByIdAndUpdate(id , { $push :{contacts : { contact : receiver._id , lastintraction: Date.now() }}})
    }

    if(!haveSenderContact){
      await User.findByIdAndUpdate(receiver._id, { $push :{contacts : {contact : id , lastintraction: Date.now()}}})
    }


    await User.findOneAndUpdate({_id : receiver._id , "contacts.contact" : id} , { $inc : {"contacts.$.unseenMessages" : 1 }})

    const message = await Message.create({
      sender: id,
      receiver: receiver._id,
      content:formData,
      seen: false,
      createdAt: Date.now(),
    });
    // console.log("message" , message)

    const receiverSocketId = userSocketMap[receiver._id.toString()];
    if(receiverSocketId){
      // console.log("recieiver" , message)
      io.to(receiverSocketId).emit("newMessage", message)
    }

    const senderSocketId = userSocketMap[id.toString()];
    if (senderSocketId) {
      // console.log("sender" , message)
      io.to(senderSocketId).emit("newMessage", message); 
    }
    
    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const {id }= req.params;
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: true, message: "Unauthorized User!" });
    }
    const message = await Message.findById(id);
    if (message?.sender.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ success: true, message: "Unauthorized User!" });
    }

    const newMessage = await Message.findByIdAndUpdate(
      id,
      { $set: { "content.text": text } },
      { new: true }
    );

    return res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: true, message: "Unauthorized User!" });
    }
    const message = await Message.findById(id);

    if (!message) {
      return res
        .status(404)
        .json({ success: true, message: "Cound not find message" });
    }

    if (message?.sender.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ success: true, message: "Unauthorized User!" });
    }

    const result = await Message.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Message Deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const setSeenTrue = async (req : Request , res:Response)=>{
  try{
    const user = req.user;
    console.log("fsvs")
    const id = req.params.id;
    const message = await Message.findById(id);
    console.log("message found" , message)
    if(!message ){
      return res.status(404).json({success:"false" , message:"Message not found"})
    }
    if( message?.receiver?.toString() !== user._id.toString()){
      return res.status(401).json({success:"false" , message:"UnAuthorized access!"})
    }
    await Message.findByIdAndUpdate(id , {seen:true});
    return res.status(200).json({success:"true" , message:"Message Updated"})
  }catch(error){
    console.log(error)
    return res.status(500).json({success:"false" , message:"Internal Server Error"})
  }
}