import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export const generateToken = (userId : String , res:Response):string=>{
    const token = jwt.sign({userId} , process.env.JWT_SECRET_KEY! ,{expiresIn:"1d"});
    res.cookie("token" , token , {httpOnly:true ,sameSite :"none" ,secure:true,maxAge  : 24*60*60*1000});
    // console.log(token)
    
    return token;
}


