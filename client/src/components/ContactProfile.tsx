import  {   useEffect, useState } from "react";
// import {userDummyData} from '../assets/assets.js'
import Avatar from '../assets/avatar_icon.png'
import type { IOtherUser, IUser } from "@/types/UserType.js";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";


// { user }: { user: any }

const ContactProfile: any = () => {
  const user = useSelector((state:RootState)=>state.user)
  const onlineUsers = useSelector((state: RootState) => state.onlineUsers);
  const selectedContact = useSelector((state:RootState)=>state.selectedContact)
  
    if(!user || !selectedContact)return <p>No user Found</p>
  const [currUser , setCurrUser] = useState<IOtherUser | IUser>(user)
  useEffect(()=>{
    if(selectedContact){
      setCurrUser(selectedContact)
    }else{
      setCurrUser(user)
    }
    
  },[selectedContact])

    const isOnline = onlineUsers?.includes(selectedContact._id.toString());


  return (
    <div className=" flex justify-center">
        <div className="h-full overflow-y-auto ">
             <div className="flex flex-col justify-center items-center gap-2.5 text-center">
                <img src={currUser.profilePic || Avatar} alt="profile" className="rounded-full h-20 w-20 object-cover "></img>
                <div className=" flex flex-col  text-sm gap-3 ">
                  <p>{currUser.fullName}</p>
                  <p>{currUser.email}</p>
                  <p>{currUser.bio}</p>
                 {isOnline &&  <p className="text-green-600">Online</p>}
                </div>
             </div>
             <div>

             </div>
        </div>
    </div>
  )
};

export default ContactProfile;
