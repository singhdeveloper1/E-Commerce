import mongoose, { Schema } from "mongoose"


const productSchema = new mongoose.Schema({
    productName : {
        type : String,
        required : true
    },

    productImage : {
        type : String,
        required : true,
        // default : "https://odoo-community.org/web/image/product.template/1844/image_1024?unique=1e911c3"
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

    category : {
        type : String,
        enum : ["Woman's Fashion", "Men's Fashiom", "Electronics", "Home and LifeStyle", "Medicine", "Sports & Outdoor", "Baby's & Toys", "Groceries & Pets", "Health & Beauty" ]
    },

    subCategory : {
        type : String,
        enum : [
            //? Woman's Fashion and Men's Fashion 
            "T-Shirts", "Jeans", "Shoes", "Jacket",             
            //? Electronics
            "Phones", "Computers", "SmartWatch", "Camera", "HeadPhone",
            //? Home and Life Style
            "Furniture", "Decor", "Cleaner",
            //? Medicine
            "capsule", "syrup",
            //? Sports and Outdoor
            "fitness", "Kit",
            //? Baby's And Toy's
            "Skates", "Kites",
            //? Grociery and Pets
            "Dairy", "Bread", "Meat",
            //? Health and Beauty 
            "Makeup", "SkinCare"
        ]
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