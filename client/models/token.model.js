import mongoose, { Schema } from "mongoose";


const tokenSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    token : {
        type : String,
        required : true
    },

    createdAt : {
        type : Date,
        default : Date.now,
        expires : 604800 // 1 week
    }
},{timestamps : true})

const Token = mongoose.model("Token", tokenSchema)

export default Token