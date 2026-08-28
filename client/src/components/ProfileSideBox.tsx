import type { IContacts } from '@/types/UserType';
import Avatar from '../assets/avatar_icon.png'

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '@/redux/store';
import { updateSelectedContact } from '@/redux/userSlice';
import { useEffect, useState } from 'react';
const ProfileSideBox = ({ userData  }:{userData: IContacts}) => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedUser = useSelector((state:RootState)=>state.selectedContact)
  const onlineUsers = useSelector((state:RootState)=>state.onlineUsers)
  const [isOnline , setIsOnline] = useState(false);
  useEffect(()=>{
    const online = onlineUsers?.includes(userData?.contact._id.toString());
    setIsOnline(online || false)
  },[onlineUsers])
  return (
    <div onClick={()=>dispatch(updateSelectedContact(userData.contact))} className={`grid grid-cols-12 gap-4 items-center p-1 border-b text-[1rem]  border-gray-300 ${selectedUser?.email === userData.contact.email ? "bg-gray-900 border-2" :"bg-gray-700"}`}>
      <div className=" h-[2.5rem] w-[2.5rem] col-span-2">
        <img
          src={userData.contact.profilePic || Avatar}
          alt="Profile"
          className={`w-full h-full rounded-full object-cover ${isOnline && "border-2 border-green-700"} `}
        />
      </div>
      <div className="col-span-8 ">
        <p>{userData.contact.email}</p>
        
          {/* {userData.online ? <p className="text-sm text-blue-500">Online</p> :<p className="text-sm text-gray-500">Offline</p>} */}
        
      </div>
      <div className="col-span-2">
        {userData.unseenMessages > 0 &&   <p className=" font-bold h-7 w-7 rounded-full bg-blue-300 text-center">
          {userData.unseenMessages}
        </p>}
      </div>
    </div>
  );
};

export default ProfileSideBox;
