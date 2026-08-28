import express from 'express'
import { addToContact, checkAuth, findContacts, findMessages, Login, logout, Register, searchContact, UpdateUser } from '../controllers/User.controller.ts';
import { Authenticate } from '../middlewares/Auth.ts';
import upload from '../middlewares/multer.ts';

const userRouter = express.Router();

userRouter.post('/register' , Register);

userRouter.post('/login'  , Login);

userRouter.patch('/update-profile' , Authenticate, upload.single("profilePic") , UpdateUser)

userRouter.get('/checkAuth' , Authenticate , checkAuth);

userRouter.patch('/add-contact/:contactEmail' , Authenticate , addToContact)

userRouter.get('/find-contacts' , Authenticate , findContacts);

userRouter.get('/find-messages/:receiverId', Authenticate , findMessages);

userRouter.get("/search-contact" , searchContact);

userRouter.post("/logout",logout);

export default userRouter
