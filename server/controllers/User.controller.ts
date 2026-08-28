import type { Request, Response } from "express";
import User from "../models/User.model.ts";
import bcrypt from "bcryptjs";
import { generateToken} from "../lib/createToken.ts";
// import {cloudinary }from "../middlewares/Cloudinary.ts";
import Message from "../models/Message.model.ts";
import mongoose from "mongoose";
import type { IMessage } from "../models/Message.model.ts";
import UploadImage from '../middlewares/ImageUpload.ts'
import UserValidator from "../validators/register.validator.ts";
import UpdateValidator from "../validators/update.validator.ts";

interface IDMessage extends IMessage {
  _id: mongoose.Types.ObjectId;
}

export const Register = async (req: Request, res: Response) => {
  const {
    email,
    fullName,
    password,
    bio,
  }: { email: string; fullName: string; password: string; bio: string } =
    req.body;

  try {
    const valid = UserValidator.safeParse(req.body)
    if(!valid?.success){
       const errorObject =
            valid.error?._zod.def.reduce(
              (acc: Record<string, string>, err: any) => {
                acc[err.path[0]] = err.message;
                return acc;
              },
              {}
            ) || {};
      return res.status(400).json({success:false , error:errorObject})
    }
    

    const prevUser = await User.findOne({ email });

    if (prevUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const salt: string = await bcrypt.genSalt(10);

    const hashedPassword: String = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      bio,
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      const token = generateToken(savedUser._id.toString(), res);
      const user = await User.findById(savedUser._id).select("-password");
      return res.status(201).json({
        success: true,
        message: "User registered Successfully",
        token,
        user
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const currUser = await User.findOne({ email });

    if (!currUser) {
      return res
        .status(401)
        .json({ success:false, message: "No user find in this email" });
    }
    
    const match = await bcrypt.compare(password, currUser.password);

    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Incorect Password" });
    }

    const token = generateToken(currUser._id.toString(), res);

    const user = await User.findById(currUser._id).populate("").populate({ path: "contacts.contact", select: "-password -contacts" })
      .sort({"contacts.lastInteraction" : -1}).select("-password");
    
    
    return res
      .status(200)
      .json({ success: true, message: "LoggedIn successfully🎉",user ,token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const logout = (req:Request , res:Response)=>{
  try{
    res.clearCookie('token', {
    httpOnly: true,
    secure: true,    
    sameSite: 'none',   
  });

  return res.status(200).json({ message: "Logged out successfully" });
  }catch(error){
    console.log(error)
    return res.status(500).json({ message: "Logout failed" });
  }
}

export const UpdateUser = async (req: Request, res: Response) => {
  

  try {
    const user = req.user   

      const {fullName ,bio} = req.body
      const valid = UpdateValidator.safeParse({fullName,bio})
      if(!valid?.success){
       const errorObject =
            valid.error?._zod.def.reduce(
              (acc: Record<string, string>, err: any) => {
                acc[err.path[0]] = err.message;
                return acc;
              },
              {}
            ) || {};
      return res.status(400).json({success:false , error:errorObject})
    }

      let profileUrl;
      if(req.file){
        const file = req.file as Express.Multer.File ;
        profileUrl = await UploadImage(file)
      }else{
        profileUrl = user.profilePic
      }
            
      const updatedUser = await User.findByIdAndUpdate(
        user?._id,
         {profilePic:profileUrl , fullName, bio} ,
       { returnDocument: 'after'}
      ).select("-password");

      if (updatedUser) {
        return res
          .status(200)
          .json({ success: true, message: "User Updated Successfully" , user:updatedUser});
      }
    }
  catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const newUser = await User.findById(user?._id).populate({ path: "contacts.contact", select: "-password -contacts" })
      .sort({"contacts.lastInteraction" : -1}).select("-password");
    return res.status(200).json({ success: true, user : newUser });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const addToContact = async (req: Request, res: Response) => {
  const user = req.user;
  const { contactEmail } = req.params;

  try {
    const contactUser = await User.findOne({ email: contactEmail });

    if (!contactUser)
      return res
        .status(404)
        .json({ success: false, message: "No User Found With this Email" });
    const thisUser = await User.findByIdAndUpdate(
      user?._id,
      {
        $push: {
          contacts: { contact: contactUser?._id, lastintraction: Date.now() , unSeenMessages : 0 },
        },
      },
      { new: true, useFindAndModify: false }
    );

    await User.findByIdAndUpdate(
      contactUser?._id,
      {
        $push: {
          contacts: { contact: contactUser?._id, lastintraction: Date.now() },
        },
      },
      { new: true, useFindAndModify: false }
    );
    return res
      .status(200)
      .json({ succes: true, message: "Contact Added SuccessFully🎉" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const findContacts = async (req: Request, res: Response) => {
  try {
    const id = req.user?._id;
    const newUser = await User.findById(id)
      .populate({ path: "contacts.contact", select: "-password -contacts" })
      .sort({"contacts.lastInteraction" : -1});
    
    return res.status(200).json({ success: true , newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const findMessages = async (req: Request, res: Response) => {
  try {
    const id = req.user?._id;
    const { receiverId } = req.params;
    // console.log(id , receiverId)
    const receiver = await User.findById(receiverId)
    // console.log(receiver)

    if(!receiver){
      return res.status(401).json({success : false , message : "No Receiver Found"})
    }
    
      const messages = await Message.find({
          $or: [
            {
              sender: id,
              receiver: receiverId,
            },
            {
              sender: receiverId,
              receiver: id,
            },
          ],
        }).sort({'createdAt' : 1});
        await Message.updateMany({ receiver : id , seen : false}, {$set : {seen:true}});

        await User.findOneAndUpdate({_id : id , "contacts.contact" : receiverId} , {"contacts.$.unseenMessages" : 0})
        // console.log(messages)

      return res.status(200).json({ success: true , messages, user:req.user });
    
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const searchContact = async(req : Request , res : Response)=>{
  const q = req.query.search as string;
  console.log(req.query)
  if (!q) {
    return res.status(400).json({ success: false, message: "Search query is required" });
  }
  try{
    const user = await User.findOne({ email: q }).select('_id name email profilePic bio fullName');
    console.log(user)
    return res.status(200).json({success:true , user});
  }catch(error){
     return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
