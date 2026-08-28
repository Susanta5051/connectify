import mongoose, { Schema } from "mongoose"

export interface IUser {
    email: string;
    fullName: string;
    password: string;
    profilePic?: string;
    bio?: string | null;
    contacts?:[mongoose.Types.ObjectId],
}

const UserSchema = new Schema({
    email:{type:String , required:true , unique : true},
    fullName : { type: String , required : true },
    password :{type : String , required :true},
    profilePic: { type:String , default :""},
    bio:{type :String},
    contacts:[{contact:{type : mongoose.Schema.Types.ObjectId ,ref:"User"},lastInteraction : {type:Date , default :Date.now()} , unseenMessages : {type: Number , default:0 }}],
} , {timestamps:true});

const User = mongoose.model("User", UserSchema);

export default User;