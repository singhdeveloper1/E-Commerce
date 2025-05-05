import mongoose, { now, Schema } from "mongoose";

const addressSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref :  "User",
        required : true
    },

    houseNumber : {
        type : String,
        required : true
    },

    country : {
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

    pinCode : {
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