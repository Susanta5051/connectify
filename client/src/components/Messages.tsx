import { useRef, useEffect, useState } from "react";
import ShadcnMessage from "./ShadcnMessage";
import axios from "axios";
import { backendUrl } from "../App.tsx";
import logo_icon from "../assets/logo_icon.png";
import type { IMessages } from "@/types/UserType.ts";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/redux/store.ts";
import { socket } from "@/contexts/socket.ts";
import { updateContacts } from "@/redux/userSlice.ts";
axios.defaults.withCredentials = true

const Messages = () => {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [typing, setTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessages[]>([]);
  
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user);
  const onlineUsers = useSelector((state: RootState) => state.onlineUsers);
  const selectedContact = useSelector((state: RootState) => state.selectedContact);
  const contacts = useSelector((state:RootState)=>state.contacts)
  

  /*
   * Fetch messages when selected user changes
   */
  useEffect(() => {
    if (!selectedContact) return;

    const fetchMessages = async () => {
      try {
        // Ensure cookieStore is globally available or imported appropriately in your project
        
        const response = await axios.get(
          `${backendUrl}/user/find-messages/${selectedContact._id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setMessages(response.data.messages);
      } catch (error: any) {
        console.error(error.response?.data?.message || error);
      }
    };

    fetchMessages();
    const currcontacts = contacts?.map((contact)=>{
      if(contact.contact._id.toString()=== selectedContact._id.toString()){
        return {
          ...contact,
          unseenMessages:0
        }
      }else{
        return contact;
      }
    })

    dispatch(updateContacts(currcontacts))
  }, [selectedContact]);

  const sendSeenTrue = async (messages:IMessages)=>{
    try{
        const response = await axios.patch(
          `${backendUrl}/messages/set-seen-true/${messages._id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
      if (!selectedContact || !user) return;
  
      const handleNewMessage = async (message: IMessages) => {
        const senderId = message.sender.toString();
        const currentSelectedId = selectedContact._id.toString();
        const currentUserId = user._id.toString();
        if (senderId === currentSelectedId || senderId === currentUserId) {
          setMessages((prev) => {
            let updatedMessages = prev;
            if (senderId === currentUserId) {
              updatedMessages = prev.map((mess) => 
                !mess.seen ? { ...mess, seen: true } : mess
              );
            }else{
              sendSeenTrue(message);
            }
            return [...updatedMessages, message];
          });
        }else{
          const newContacts = contacts?.map((contact) => {
                    if (senderId === contact.contact._id.toString()) {
                      return {
                        ...contact,
                        unseenMessages: contact.unseenMessages + 1,
                        lastInteraction: new Date().toISOString(),
                      };
                    }
                    return contact;
                  });
                  
                  if (newContacts) {
                    dispatch(updateContacts(newContacts));
                  }
        }
      };

      const handleUserTyping = (data: { senderId: string; isTyping: boolean }) => {
        if (selectedContact._id.toString() === data.senderId.toString()) {
          setTyping(data.isTyping);
        }
      };
  
      socket.on("userTyping", handleUserTyping);
      socket.on("newMessage", handleNewMessage);
  
      return () => {
        socket.off("userTyping", handleUserTyping);
        socket.off("newMessage", handleNewMessage);
      };
    }, [selectedContact, user]);
  

  /*
   * Listen for real-time online users array list updates
   */
  

  /*
   * Socket Events: Typing, Individual User Status, and New Messages
   */
  

  /*
   * Scroll down automatically on new messages
   */
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Conditional rendering placed after hook initializations to comply with React rules
  if (!user) return null;

  if (!selectedContact) {
    return (
      <div className="flex-1 flex justify-center items-center text-center text-4xl">
        <div>
          <img src={logo_icon} alt="Logo" />
          <p>Select a user</p>
        </div>
      </div>
    );
  }

  const isOnline = onlineUsers?.includes(selectedContact._id.toString());

  return (
    <div ref={messagesRef} className="flex-1 overflow-y-auto mb-12">
      {messages.length > 0 ? (
        <div className="flex flex-col bottom-0">
          {messages.map((mess) => (
            <ShadcnMessage key={mess._id.toString()} message={mess} />
          ))}
          {typing && (
            <div className="p-2">
              <p className=" text-red-400 inline px-3 py-0.5 animate-pulse">
                Typing...
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center backdrop-blur-3xl text-center h-full">
          <img src={logo_icon} alt="Logo" className="h-[30%] opacity-90" />
          <p>No Messages Yet</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
