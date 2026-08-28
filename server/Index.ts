import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import connectDB from './lib/db.ts';
import userRouter from './routes/User.route.ts'
import messageRouter from './routes/Message.route.ts'
import cors from "cors"
import http from "http"
import { InitializeSocket } from './lib/socket.ts';
import cookieParser from "cookie-parser";



const app = express();
const port = 3000;
const server = http.createServer(app)

app.use(cors({
    origin:[
            "http://localhost:5173",
    ],
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())


connectDB()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection failed:", err));

app.get("/" , (req , res)=>{
    res.send("App is Liste")
})

app.use("/api/user" , userRouter);
app.use("/api/message" , messageRouter);

InitializeSocket(server)

server.listen(port , ()=>{
    console.log(`App is listening to ${port}`)
})

