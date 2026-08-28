// import type { IContacts, IOtherUser, IUser } from '@/types/UserType';
import Avatar from '../assets/avatar_icon.png'

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { updateSelectedContact } from '@/redux/userSlice';
const SearchedContact = ({ userData  }:{userData: any}) => {
  
const dispatch = useDispatch<AppDispatch>()
const selectedContact = useSelector((state:RootState)=>state.selectedContact)

  return (
    <div onClick={(e)=>dispatch(updateSelectedContact(userData))} className={`grid grid-cols-12 gap-4 items-center p-1 border-b border-gray-300 ${selectedContact?.email === userData.email ? "bg-gray-900 border-2" :"bg-gray-700"}`}>
      <div className=" h-12 w-12 col-span-2">
        <img
          src={userData.profilePic || Avatar}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <div className="col-span-8 ">
        <p>{userData.email}</p>
        
          {/* {userData.online ? <p className="text-sm text-blue-500">Online</p> :<p className="text-sm text-gray-500">Offline</p>} */}
        
      </div>
    </div>
  );
};

export default SearchedContact;
