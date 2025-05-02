import mongoose, { Schema } from "mongoose";

const saleSchema = new mongoose.Schema({
        startTime : {
            type : Date,
            required : true
        },

        endTime : {
            type : Date,
            required : true
        },

        discount : {
            type : Number,
            required : true
        }
})

const Sale = mongoose.model("Sale", saleSchema)

export default Sale