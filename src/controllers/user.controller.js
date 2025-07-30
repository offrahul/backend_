
import {asyncHandler} from "../utils/ashnchandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";



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

export {registerUser}