import mongoose, { Schema } from "mongoose"


const orderSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

    products : [
        {
            productId : {
                type : Schema.Types.ObjectId,
                ref : "Product",
                required : true
            },

            
                title : {
                    type : String,
                    required : true
                },

                image : {
                    type : String,
                },           

                price : {
                    type : Number,
                    required : true
                },

                variant : {
                    size : {
                        type : String,
                        enum : ["XS", "S", "M", "L","XL"]
                    },
                    color : {
                        type : String,
                        enum : ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Gray", "Brown", "Gold", "Silver"]
                    }
                },

            quantity : {
                type : Number,
                required : true
            }
        }
    ],

    // payment : {
    //     type : String,
    //     enum : ["COD", "Bank"]
    // },

    payment : {
        method : {
            type : String,
            enum : ["COD", "Bank"]
        },
        status : {
            type : String,
            enum : ["Pending", "Paid"],
            default : "Pending"
        },
        paymentId : {
            type : String,
            default : null
        },
        orderId : {
            type : String,
            default : null
        }
    },

     address : {
        firstName : {
            type : String,
            required : true
        },

        company : {
            type : String
        },

        street : {
            type : String,
            required : true
        },

        apartment : {
            type : String
        },

        city : {
            type : String,
            required : true
        },

        phone : {
            type : String,
            required : true
        },

        email : {
            type : String,
            required : true,
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"],
        }
     }

    // address : {
    //     type : Schema.Types.ObjectId,
    //     ref : "Address",
    //     required : true
    // }
},{timestamps : true})

const Order = mongoose.model("Order", orderSchema)

export default Order