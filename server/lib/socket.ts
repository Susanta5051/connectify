import { Server } from "socket.io";
import http from 'http'

// interface FormDataType{
//     text:string | null,
//     file:File |undefined,
//     image:File | undefined
// }

export let io :Server;
export const userSocketMap: Record<string, string>  = {};



export const InitializeSocket = (server : http.Server)=>{
    io = new Server(server,{
        cors :{origin :'*'}
    });

    io.on("connection" , (socket)=>{
        const userId:any = socket.handshake.query.userId;
        // console.log("User Connected", userId)
    
        if(userId) userSocketMap[userId] = socket.id;
    
        io.emit("getOnlineUsers" , Object.keys(userSocketMap))

        // socket.on("sendMessage", (data: { receiverId: string; formData: FormDataType }) => {
        //     const { receiverId, formData } = data;
        //     const receiverSocketId = userSocketMap[receiverId];
        //     console.log("data rex", data)
        //     const messagePayload = {
        //     sender: socket.handshake.query.userId,
        //     receiver : receiverId,
        //     formData,
        //     createdAt: new Date(),
        //     };

        //     if (receiverSocketId) {
        //     // Send directly to the target recipient's socket session
        //     io.to(receiverSocketId).emit("newMessage", messagePayload);
        //     } else {
        //     // Handle offline user scenario (e.g., save to DB, send push notification)
        //     console.log(`User ${receiverId} is offline. Message cached.`);
        //     }

        //     socket.emit("newMessage", messagePayload);
        // });

        socket.on("typing", (data: { receiverId: string; isTyping: boolean }) => {
            const receiverSocketId = userSocketMap[data.receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("userTyping", {
                    senderId: socket.handshake.query.userId,
                    isTyping: data.isTyping
                });
            }
        });

    
        socket.on("disconnect",()=>{
            // console.log("User Disconnected" , userId);
            delete userSocketMap[userId];
            io.emit("getOnlineUsers" , Object.keys(userSocketMap))
        })
    })

}