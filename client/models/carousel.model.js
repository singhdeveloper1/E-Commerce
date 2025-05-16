import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
    image : {
        type : String,
        required : true
    },

    title : {
        type : String,
        required : true
    },

    subTitle : {
        type : String,
        required : true
    },

    link : {
        type : String,
        required:  true
    }, 

    isActive : {
        type : Boolean,
        required : true,
        default : true
    }
},{timestamps : true})

const Carousel = mongoose.model("Carousel", carouselSchema)

export default Carousel