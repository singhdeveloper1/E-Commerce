import mongoose, { Schema } from "mongoose";

const couponSchema = new mongoose.Schema({
    code : {
        type : String,
        required : true
    },

    discountType : {
        type : String,
        enum : ["Percentage", "Fixed"],
        required : true
    },

    discountValue : {
        type : Number,
        required : true
    },

    expiresAt : {
        type : Date,
        required : true
    },

    usedBy : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

const Coupon = mongoose.model("Coupon", couponSchema)

export default Coupon