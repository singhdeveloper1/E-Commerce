import mongoose, { Schema } from "mongoose";

const addToWishlistSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

    products : [
        {
            productId : {
                type : Schema.Types.ObjectId,
                ref : "Product"
            }
        }
    ]
})

const AddToWishlist = mongoose.model("AddToWishlist", addToWishlistSchema)

export default AddToWishlist