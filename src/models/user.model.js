import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true// searching field enable
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
   
    },
   fullName:{
        type:String,
        required:true,
       index:true,
        trim:true
        
    },
    avatar:{
        type:String,//cloudinary url
        required:true,
    },
    coverImage:{
         type:String,//cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"],
        
    },
    refreshToken:{
        type:String
    }
},{timestamps:true
})






//hash before saved middleware
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10);
    next()

})




//method

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

   userSchema.methods.generateAccessToken= function(){// athentication
     return  jwt.sign({_id:this._id,
        email:this.email,         
        username:this.username,
        fullname:this.fullName
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
   }
       
   userSchema.methods.generateRefreshToken=function(){//db save and user save en d point heat
     return  jwt.sign({_id:this._id
       
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
   }





const User= mongoose.model("User",userSchema);
export  {User};