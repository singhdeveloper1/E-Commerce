import mongoose, { Schema } from "mongoose";


const contactSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    contact : [
        {
            name : {
            type : String,
            required : true
            },

            email : {
                type : String,
                required : true
            },

            phone : {
                type : Number,
                required : true,
            },

            message : {
                type : String,
                required : true,
            },

            sentTime : {
                type : Date,
                default : Date.now()
            }
        }
    ]

    
},{timestamps : true})

const Contact = mongoose.model("Contact", contactSchema)

export default Contact