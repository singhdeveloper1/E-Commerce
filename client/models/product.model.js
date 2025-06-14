import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    productImage: {
      // type : String,
      type: [String],
      required: true,
      // default : "https://odoo-community.org/web/image/product.template/1844/image_1024?unique=1e911c3"
    },

    productPrice: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: ["USD", "INR"],
      default: "USD",
      required: true,
    },

    currencyStyle: {
      type: String,
      default: "en-US",
      required: true,
    },

    // discountedPrice : {
    //     type : Number
    // },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    productDescription: {
      type: String,
      maxlength: 200,
      required: true,
    },

    productSize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL"],
    },

    productColor: {
      type: String,
      enum: [
        "Red",
        "Blue",
        "Green",
        "Yellow",
        "Orange",
        "Purple",
        "Pink",
        "Black",
        "White",
        "Gray",
        "Brown",
        "Gold",
        "Silver",
      ],
    },

    category: {
      type: String,
      enum: [
        "Woman's_Fashion",
        "Men's_Fashion",
        "Electronics",
        "Home_and_LifeStyle",
        "Medicine",
        "Sports_&_Outdoor",
        "Baby's_&_Toys",
        "Groceries_&_Pets",
        "Health_&_Beauty",
      ],
    },

    subCategory: {
      type: String,
      enum: [
        //? Woman's Fashion and Men's Fashion
        "T-Shirts",
        "Jeans",
        "Shoes",
        "Jacket",
        //? Electronics
        "Phones",
        "Computers",
        "SmartWatch",
        "Camera",
        "HeadPhone",
        //? Home and Life Style
        "Furniture",
        "Decor",
        "Cleaner",
        //? Medicine
        "capsule",
        "syrup",
        //? Sports and Outdoor
        "fitness",
        "Kit",
        //? Baby's And Toy's
        "Skates",
        "Kites",
        //? Grociery and Pets
        "Dairy",
        "Bread",
        "Meat",
        //? Health and Beauty
        "Makeup",
        "SkinCare",
      ],
    },

    sale: {
      type: Boolean,
      default: false,
    },

    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // category : {
    //     type
    // }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
