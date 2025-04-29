import mongoose, { Schema } from "mongoose"


const productSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true
    },

    productImage : {
        type : String,
        // required : true,
        default : "https://odoo-community.org/web/image/product.template/1844/image_1024?unique=1e911c3"
    },

    productPrice : {
        type : Number,
        required : true
    },

    // discountedPrice : {
    //     type : Number
    // },

    discountPercentage : {
        type : Number
    },

    productDescription : {
        type : String,
        maxlength : 200,
        required : true
    },

    productSize : {
        type : String,
        enum : ["XS", "S", "M", "L","XL"]
    },

    productColor : {
        type : String,
        enum : ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Gray", "Brown", "Gold", "Silver"]
    },

    seller : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    // category : {
    //     type
    // }
}, {timestamps : true})

const Product = mongoose.model("Product", productSchema)

export default Product