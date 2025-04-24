import mongoose, { Schema } from "mongoose";


const addToCartSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

    products : [
        {
            productId :{
             type : Schema.Types.ObjectId,
             ref : "Product"
            },

            quantity : {
                type : Number,
                default : 1,
                required : true
            }
        }
    ]
},{timestamps : true})

const AddToCart = mongoose.model("AddToCart", addToCartSchema)

export default AddToCart