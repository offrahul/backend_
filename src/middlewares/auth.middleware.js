import { asyncHandler } from "../utils/ashnchandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT =asyncHandler(async(req,_,next)=>{
   try {
    const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
 
    if(!token){ return next(new ApiError("Not Authenticated",401))}
  const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
 const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
 
 if(!user){return next(new ApiError("inavalid access token",401))}
 
 req.user=user
 next()
   } catch (error) {
    throw new ApiError("inavalid access token",401)
   }

 })

 