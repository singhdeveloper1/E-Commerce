import mongoose, { Schema } from "mongoose";

const addToWishlistSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    products : [
        {
            productId : {
                type : Schema.Types.ObjectId,
                ref : "Product",
                required : true
            }
        }
    ]
})

const AddToWishlist = mongoose.model("AddToWishlist", addToWishlistSchema)

export default AddToWishlist