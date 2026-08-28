import {v2 as cloudinary} from "cloudinary"
import type{ Multer} from "multer"
 import dotenv from 'dotenv'
 import path from "path"; 
 dotenv.config()

// console.log("apikey" ,process.env.JWT_SECRET_KEY)
// if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
//   throw new Error("Missing critical Cloudinary configuration environment variables.");
// }

cloudinary.config({ 
    api_key: process.env.API_KEY!,
    cloud_name:process.env.CLOUD_NAME!,
    api_secret:process.env.API_SECRET!
});

const uploadOnCloudinary = async (file:Express.Multer.File)=>{
    try{
        // console.log(process.env.API_KEY , "   ",process.env.CLOUD_NAME, "      ",process.env.API_SECRET)
        const base64Image = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64Image}`;
        const originalNameWithExt = file.originalname; 
        const cleanPublicId = path.parse(originalNameWithExt).name;
        const uploadResponse  = await cloudinary.uploader.upload(dataUri, {resource_type : "auto", public_id: cleanPublicId,use_filename : true , unique_filename:false});
        return uploadResponse.secure_url;
    }catch(error){
        console.log(error)
    }
}

export default uploadOnCloudinary;