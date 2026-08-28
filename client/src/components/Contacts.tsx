// import React from "react";
// import assets from "../assets/assets.js";
// import {userDummyData} from "../assets/assets.js";

import LogoProfile from "./LogoProfile.tsx";
import SearchBox from "./SearchBox.tsx";
import ProfileSideBox from "./ProfileSideBox.tsx";
import SearchedContact from "./SearchedContacts.tsx";
// import type { IContacts } from "@/types/UserType.ts";
// import type { ObjectId } from "mongoose";
import { useEffect, useState } from "react";
import type { IContacts } from "@/types/UserType.ts";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/redux/store.ts";
import { updateContacts } from "@/redux/userSlice.ts";
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import Setting from "./Setting.tsx";

const Contacts = () => {
  const [currContacts , setCurrContacts] = useState<IContacts[] | undefined>(undefined);

  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state:RootState)=>state.user)
  const contacts = useSelector((state:RootState)=>state.contacts)
  const searchValue = useSelector((state:RootState)=>state.searchValue)
  const searchedContact = useSelector((state:RootState)=>state.searchedContact)
  const selectedContact = useSelector((state:RootState)=>state.selectedContact)
  // console.log(currContacts , contacts)
  useEffect(()=>{
    
    if(searchValue.trim() !==""){
      let match = user?.contacts?.filter((con)=>con?.contact?.email.includes(searchValue))
      dispatch(updateContacts(match))
    }else{
      dispatch(updateContacts(user?.contacts))
    }
  },[searchValue])

  useEffect(() => {
    if(contacts !== null){
      const sortContacts = [...contacts].sort((a,b)=> {
        const timeA = new Date(a.lastInteraction).getTime();
        const timeB = new Date(b.lastInteraction).getTime();
        
        return timeB - timeA;
      })
      setCurrContacts(sortContacts)
    }
  }, [user,contacts]);

  useEffect(() => {
    if(contacts !== null){
      const sortContacts = [...contacts].sort((a,b)=> {
        const timeA = new Date(a.lastInteraction).getTime();
        const timeB = new Date(b.lastInteraction).getTime();
        
        return timeB - timeA;
      })
      setCurrContacts(sortContacts)
    }
  }, []);

  useEffect(()=>{
    if(contacts !== null){
      const seenContacts = [...contacts].map((contact)=>{
      if(contact.contact._id.toString() === selectedContact?._id.toString()){
        return {
          ...contact,
          unseenMessages:0
        }
      }else{
        return contact
      }
     })
     setCurrContacts(seenContacts)
    }
     
  },[selectedContact])

  if (!user) return;

  return (
    <div className="flex flex-col h-full backdrop-blur-md ">
      <LogoProfile />
      <SearchBox />
      {searchValue && <div>{ searchedContact ? <SearchedContact userData={searchedContact}></SearchedContact>: <div>No contacts Found</div>}</div>}
      <div className="flex-1 overflow-y-auto">
        {currContacts &&
          currContacts.map((user: any) => (
            <ProfileSideBox key={user._id} userData={user} />
          ))}
      </div>
      <div className="absolute bottom-1"><Setting /></div>
    </div>
  );
};

export default Contacts;
