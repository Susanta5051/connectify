// import React from 'react'
import { lazy,Suspense } from "react";
// import ChatContainer from './ChatContainer'
import ChatInput from "./ChatInput";
// import ShadcnMessage from './ShadcnMessage'
// import Messages from "./Messages";
import ChatHeader from "./ChatHeader";
import { Loader } from "lucide-react";

const Messages = lazy(()=> import('./Messages.tsx'))

const ChatHistory = () => {
  return (
    <div className="h-full flex flex-col  backdrop-blur-md">
      <div className="block lg:hidden">
        <ChatHeader />
      </div>

      <div className="flex-1 flex overflow-y-auto">
        <Suspense fallback={<div className="w-full flex justify-center h-full items-center"><Loader className="size-20 spin" /></div>} >
          <Messages />
        </Suspense>
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatHistory;
