
import express from "express";
import { createMessage, deleteMessage, setSeenTrue, updateMessage } from "../controllers/Message.controller.ts";
import {Authenticate} from "../middlewares/Auth.ts"
import upload from "../middlewares/multer.ts";

const messageRouter = express.Router();

messageRouter.post('/create'  , Authenticate,upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), createMessage);
messageRouter.patch('/update/:id' , Authenticate , updateMessage);
messageRouter.delete('/delete/:id',Authenticate , deleteMessage);
messageRouter.patch('set-seen-true/:id',Authenticate ,setSeenTrue);

export default messageRouter
                            