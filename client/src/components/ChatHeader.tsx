import { useEffect } from "react";
// import {userDummyData} from '../assets/assets.js'
// import type { IOtherUser, IUser } from "@/types/UserType.js";
import Avatar from "../assets/avatar_icon.png";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const ChatHeader = () => {
  const selectedContact = useSelector((state:RootState)=>state.selectedContact)
  const onlineUsers= useSelector((state:RootState)=>state.onlineUsers)

  useEffect(() => {}, [selectedContact]);

  if (!selectedContact) return null;
  const isOnline = onlineUsers?.includes(selectedContact._id.toString())

  return (
    <div className="flex justify-between items-center px-4 border-b-2   backdrop-blur-none bg-gray-100/30  p-1">
        <div className={`h-10 w-10 rounded-full overflow-hidden border-2 ${isOnline && "border-green-600"} `}>
          <img src={selectedContact?.profilePic || Avatar} alt="profile" className="object-cover h-10 w-10"></img>
        </div>
      <div className={`${isOnline && "text-green-600"}`}>{selectedContact.fullName}</div>
    </div>
  );
};

export default ChatHeader;
