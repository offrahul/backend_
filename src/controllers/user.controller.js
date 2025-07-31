
import {asyncHandler} from "../utils/ashnchandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";
import jwt from "jsonwebtoken"

//gegerate token
const generateAccesRefreshToken=async(userId)=>{
    try{
        const user=await User.findById(userId);
        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken}

    }catch(err){
        throw new ApiError("Error in generating token",500)
    }
}






const registerUser=asyncHandler(async(req,res,next)=>{
    // const user=await User.create(req.body)
    // res.status(200).json({ 
    //     message:"User created successfully in website",
       
    // })


    //step to register user
    //1. get user from frontend or postman
    //2. validation - not empty
    //3. check if user already exist : username,email
    //4. check for image and for avatar
    //upload to cloudinary,avatar
    //create user object-create entry in db
    //remove password and refesh token from response
    //check user creation
    //return for response

    const {fullName,username,email,password}=req.body
    // console.log(req.body)
   if(
    [fullName,username,email,password].some((fields)=>fields?.trim()==="")
   ){
    throw new ApiError("Please fill all the fields",400)
   }
    

   //step 2
  const existedUser=await User.findOne({
    $or:[{username},{email}]
   
   })

   if(existedUser){
    throw new ApiError("User already exist",409)
   }
   //step 3

const avatarLoacalPath= req.files?.avatar[0]?.path;

//  const coverageLoacalPath= req.files?.coverImage[0]?.path
let coverageLoacalPath;
 if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverageLoacalPath=req.files.coverImage[0].path
 }

if(!avatarLoacalPath){
    throw new ApiError("Please upload avatar",400)
}
//upload in cloudinary
const avatar= await uploadOnCloudinary(avatarLoacalPath);
const coverImage= await uploadOnCloudinary(coverageLoacalPath);

if(!avatar){
    throw new ApiError("Please upload avatar and cover image",400)
}
//create object and entry in db 
const user= await User.create({
    fullName,
    username:username.toLowerCase(),
    email,
    password,
    avatar:avatar.url,
     coverImage:coverImage?.url || ""
})
//remove password from user object
const createdUser=await User.findById(user._id).select("-password -__refreshToken")//- sign we dont require

if(!createdUser){
    throw new ApiError("something ent user while registering the user",500)
}

//response
return res.status(201).json(new ApiResponse("User created successfully",createdUser,200))

})



//login
const loginUser=asyncHandler(async(req,res)=>{
    //req body= data parse
    //username or email access
    //find the user
    //compare password
    //create token send to user
    //send cookie
    //response

    const {username,email,password}=req.body;
    // const user=await User.findOne({$or:[{username},{email}]}).select("-__refreshToken -password")

    if(!username && !email){
        throw new ApiError("Please provide username or email",400)
    }
    const user=await User.findOne({$or:[{username},{email}]})

if(!user){
    throw new ApiError("User not found",404)
}

const isPasswordMatched=await user.isPasswordCorrect(password)

if(!isPasswordMatched){
    throw new ApiError("invalid user credentials",404)
}
const {accessToken,refreshToken}=await generateAccesRefreshToken(user._id)


//send in cookie
 const loggedInUser=await User.findByIdAndUpdate(user._id).select("-__refreshToken -password")
 

 const options={
     httpOnly:true,
     secure:true,
 }
 return res.status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"user logged In succesfully")
     
 )



})



const logoutUser=asyncHandler(async(req,res)=>{
    //release cookie 
  await  User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{
        new:true,
    })

const option={
httpOnly:true,
secure:true,
}

return res.status(200)
.clearCookie("accessToken",option)
.clearCookie("refreshToken",option)
.json(new ApiResponse(200,{},"user logged out succesfully"))

})




//refresh accesss token give to database match and renew //lec 17

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"refresh token not found")
    }

   try {
    const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user=await User.findById(decodedToken?._id)
 
    if(!user){
         throw new ApiError(401,"invalid refresh token")
     }
 
     if(user.refreshToken!==incomingRefreshToken){
         throw new ApiError(401,"expired refresh token")
     }
 
     ///create token
     const option={
         httpOnly:true,
         secure:true,
     }
   const{accessToken,newRefreshToken}=await generateAccesRefreshToken(user._id);
 
   return res.status(200)
   .cookie("accessToken",accessToken,option)
   .cookie("refreshToken",refreshToken,option)
   .json(new ApiResponse(200,{accessToken,newreRreshToken},"token generated succesfully"))
 
 
   } catch (error) {
    throw new ApiError(401,error?.message ||"invalid refresh token")
   }
})


export {registerUser,loginUser,logoutUser,refreshAccessToken}