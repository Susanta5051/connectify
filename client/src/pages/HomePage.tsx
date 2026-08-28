import React, {  useEffect, useState } from "react";
// import ChatContainer from "../components/ChatContainer";
import ContactProfile from "../components/ContactProfile";
import Contacts from "../components/Contacts";
import ChatHistory from "../components/ChatHistory";
import type {AppDispatch, RootState} from '../redux/store.ts'
import {useDispatch, useSelector} from 'react-redux'
import { checkAuth, updateOnlineUsers } from "@/redux/userSlice.ts";
import { socket } from "@/contexts/socket.ts";
import { updateContacts } from "@/redux/userSlice.ts";
import type { IMessages } from "@/types/UserType.ts";



const HomePage: React.ComponentType =  () => {
    const contacts = useSelector((state: RootState) => state.contacts);
  
  const dispatch = useDispatch<AppDispatch>()  

  const user  =useSelector((state:RootState)=>state.user)
   const selectedContact = useSelector((state:RootState)=>state.selectedContact)


  //  useEffect(() => {
  //   const handleOnlineUsers = (users: string[]) => {
  //     setOnlineUsers(users);
  //   };

  //   socket.on("getOnlineUsers", handleOnlineUsers);
  //   return () => {
  //     socket.off("getOnlineUsers", handleOnlineUsers);
  //   };
  // }, []);


   useEffect(() => {
    if (!selectedContact || !user) return;

    

    const handleGetOnlineUser = (users: string[]) => {
      dispatch(updateOnlineUsers(users))
    };



    socket.on("getOnlineUsers", handleGetOnlineUser);

    return () => {
      socket.off("getOnlineUsers", handleGetOnlineUser);
    };
  }, [selectedContact, user, contacts]);

  

  useEffect(()=>{},[user , selectedContact])



  return (
    <div >
      <div className={`h-screen flex `}>
        <div  className={`w-[30%] md:w-[32%] lg:w-[28%] border-r backdrop-blur-2xl ${user ? "hidden sm:block" : "block"}`}><Contacts   /></div>
        <div className={`flex-1 backdrop-blur-2xl ${user ? "block" : "hidden md:block"} `}>{ user && <ChatHistory /> }</div>
        { selectedContact &&<div className={` hidden lg:block w-[15%] backdrop-blur-2xl border-l p-5 `}> <ContactProfile /></div>}
      </div>
    </div>
  );
};

export default HomePage;
