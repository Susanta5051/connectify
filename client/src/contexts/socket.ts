import { io } from "socket.io-client";
// import dotenv from 'dotenv'
// dotenv.config()
const SOCKET_URL = import.meta.env.BACKEND_URL || "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
}); 