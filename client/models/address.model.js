import mongoose, { Schema } from "mongoose";

const addressSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref :  "User"
    },

    address : {
        type : String,
        required : true
    },

    state : {
        type : String,
        required : true
    },

    city : {
        type : String,
        required : true
    },

    pincode : {
        type : String,
        required : true
    },

    phone : {
        type : Number,
        required : true
    }

})

const Address = mongoose.model("Address", addressSchema)

export default Address