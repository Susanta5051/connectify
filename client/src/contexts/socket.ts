import { io } from "socket.io-client";
// import dotenv from 'dotenv'
// dotenv.config()
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
}); 