import { Schema } from "mongoose";

const subscriptionSchema = new Schema({
subscriber:{
    type:Schema.Types.ObjectId,//subscriber is user id
    ref:"User"
},
channel:{
    type:Schema.Types.ObjectId,//to whom we subscribe
    ref:"User"
}

    
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)