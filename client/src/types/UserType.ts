
import type { FormDataType } from '@/components/ChatInput';
import mongoose from 'mongoose'
export interface IOtherUser {
    _id:mongoose.Types.ObjectId;
    email: string;
    fullName: string;
    profilePic?: string;
    bio: string;
    
}


export interface IUser extends IOtherUser{
    contacts?: IContacts[]  ,
}   

export interface IContacts {
    contact:IOtherUser,
    unseenMessages:number,
    lastInteraction : any
}

export interface IMessages {
    content:{
        text:string | null | undefined ,
        image : string | null | undefined,
        file : string | null | undefined
    }
    sender : {type : mongoose.Types.ObjectId},
    receiver : {type : mongoose.Types.ObjectId},
    seen:boolean,
    createdAt:{type : Date},
    _id:mongoose.Types.ObjectId
}


