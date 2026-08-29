import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.ts";

import {type IUser } from "../models/User.model.ts";
import mongoose from "mongoose";

interface UUser extends IUser{
  _id: mongoose.Types.ObjectId;
}

declare global {
  namespace Express {
    interface Request {
      user: UUser;
    }
  }
}

export {};

export const Authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.path)
      const token = req.cookies.token;
    if (!token || Array.isArray(token))
      return res.status(401).json({ success: false, message: "" });

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as jwt.JwtPayload;

    // console.log(decoded)
    if (!decoded?.userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user || user === undefined) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};
