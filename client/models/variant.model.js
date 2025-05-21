import mongoose from "mongoose";


const variantSchema = new mongoose.Schema({
    productId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        required : true
    },

    color : {
        type : String,
        required : true,
        enum : ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Gray", "Brown", "Gold", "Silver"]
    },

    size : {
        type : String,
        required: true,
        enum : ["XS", "S", "M", "L","XL"]
    },

    price : {
        type : Number,
        required : true
    }
})

const Variant = mongoose.model("Variant", variantSchema)

export default Variant