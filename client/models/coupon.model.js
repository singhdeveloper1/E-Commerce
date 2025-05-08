import mongoose, { Schema } from "mongoose";

const couponSchema = new mongoose.Schema({
    coupon : {
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

    //! this to make expiry optional only to set welcome coupon permanent
    // expiresAt : {
    //     type : Date,
    //     default : null
    // },

    usedBy : [{
        type : Schema.Types.ObjectId,
        ref : "User"
    }],

    isForNewUser :{
        type : Boolean,
        default : false
    }
})

const Coupon = mongoose.model("Coupon", couponSchema)

export default Coupon