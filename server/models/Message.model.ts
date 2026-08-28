import mongoose from "mongoose";

export interface IMessage {
    content: {
        text:String ,
        image:String,
        file:String,
    },
    sender:{ type:mongoose.Types.ObjectId , ref:"User"},
    receiver:{ type:mongoose.Types.ObjectId , ref:"User"},
    seen:Boolean,
    createdAt: Date 
}

const messageSchema = new mongoose.Schema({
    content: {
        type:{
            text:String ,
            image:String,
            file:String,
        },
        required:true
    },
    sender:{type :mongoose.Types.ObjectId , required:true},
    receiver: { type : mongoose.Types.ObjectId , required : true},
    seen:{type :Boolean , default:false},
    createdAt:{type : Date ,required :true}
}, {timestamps : true})


const Message = mongoose.model('Message' ,  messageSchema);
export default Message;