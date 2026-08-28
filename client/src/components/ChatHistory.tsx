// import React from 'react'
// import ChatContainer from './ChatContainer'
import ChatInput from "./ChatInput";
// import ShadcnMessage from './ShadcnMessage'
import Messages from "./Messages";
import ChatHeader from "./ChatHeader";

const ChatHistory = () => {
  return (
    <div className="h-full flex flex-col  backdrop-blur-md">
      <div className="block lg:hidden">
        <ChatHeader />
      </div>

      <div className="flex-1 flex overflow-y-auto">
        <Messages />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatHistory;
