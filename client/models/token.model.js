import mongoose, { Schema } from "mongoose";


const tokenSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

    token : {
        type : String,
        required : true
    },

    expiry : {
        type : Date,
        default : Date.now,
        expires : 3600   // 1 hour
    }
},{timestamps : true})

const Token = mongoose.model("Token", tokenSchema)

export default Token