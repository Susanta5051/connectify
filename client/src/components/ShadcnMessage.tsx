// "use client"

import { DownloadIcon, FileTextIcon } from "lucide-react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import {  useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const ShadcnMessage = ({message}: { message:any }) => {

  
  const user = useSelector((state:RootState)=>state.user)
   const pdfUrl = message.content?.file;
   const unseen = (!message.seen && message.receiver?.toString() === user?._id?.toString())
  const position = (user?._id?.toString() === message?.sender?.toString())?"end" : "start"

  // console.log(position , "  ", user?._id?.toString() ,"  ", message?.sender?.toString() )
  // 1. Manage file states properly so React re-renders when data arrives
  const [fileName, setFileName] = useState("Loading...");
  const [fileSize, setFileSize] = useState("Calculating...");

  useEffect(() => {
    if (!pdfUrl) return;

    // Extract name instantly from the URL text string
    const rawFileName = pdfUrl.split("/").pop() || "file.pdf";
    const displayName =  decodeURIComponent(rawFileName);
    
    setFileName(displayName);

    // Fetch size asynchronously in a safe lifecycle hook
    fetch(pdfUrl, { method: "HEAD" })
      .then((res) => {
        const bytes = res.headers.get("content-length");
        if (bytes) {
          const numBytes = parseInt(bytes, 10);
          const formattedSize =
            numBytes >= 1048576
              ? `${(numBytes / 1048576).toFixed(1)} MB`
              : `${(numBytes / 1024).toFixed(0)} KB`;
          setFileSize(formattedSize);
        } else {
          setFileSize("PDF Document");
        }
      })
      .catch((error) => {
        console.log("Header fetch error, falling back:", error);
        setFileSize("PDF Document");
      });
  }, [pdfUrl]);
 
  return (
    <div className={`flex w-full h-auto ${position === "start" ? "justify-start" : "justify-end"}  px-5 py-2 ${unseen ? "bg-muted/30" : ""} `}>
      <Message align={position}>
        <MessageContent>
          {message.content.image && <Attachment orientation="vertical">
            <AttachmentMedia variant="image">
              <a href={message.content.image}>
                <img
                  src={message.content.image}
                  alt="Workspace"
                  />
              </a>
            </AttachmentMedia>
          </Attachment>}

           

          {message.content.file &&
          
          <Attachment>
            
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{fileName}</AttachmentTitle>
              <AttachmentDescription>{fileSize}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction
                type="button"
                title="Download"
                aria-label="Download"
                size="icon-sm"
                variant="secondary"
              >
                  <a href={message.content.file}><DownloadIcon /></a>
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>

              
          }
          
          {message.content.text && <Bubble className="">
            <BubbleContent className="">
              {message.content.text}
            </BubbleContent>
          </Bubble>}
          <p className={`flex text-xs  ${position === "start" ? "justify-start" : "justify-end"} `}>
            {new Date(message.createdAt).toLocaleString("en-IN", { dateStyle: 'medium', timeStyle: 'short' })}
          </p>

        </MessageContent>
        
      </Message>
      
      {/* <Message>
        <MessageContent>
          <Bubble >
            <BubbleContent>
              Done. Here&apos;s the PDF with the image added as the cover page.
            </BubbleContent>
          </Bubble>
          
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble>
            <BubbleContent>Thanks. Looks good.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message> */}
    </div>
  );
};

export default ShadcnMessage;
