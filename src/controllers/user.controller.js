
import {asyncHandler} from "../utils/ashnchandler.js";


const registerUser=asyncHandler(async(req,res,next)=>{
    // const user=await User.create(req.body)
    res.status(200).json({ 
        message:"User created successfully in website",
       
    })
})

export {registerUser}