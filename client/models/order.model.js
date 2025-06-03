import mongoose, { Schema } from "mongoose"


const orderSchema = new mongoose.Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },

    orders : [
        {
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
                        required : true
                    },
                    price : {
                        type : Number,
                        required : true
                    },
                    size : {
                        type : String,
                        enum : ["XS", "S", "M", "L","XL"]
                    },
                    color : {
                        type : String,
                        enum : ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Gray", "Brown", "Gold", "Silver"]
                    } ,
                    quantity : {
                        type : Number,
                        required : true
                    },

                    isCancel : {
                        type : Boolean,
                        default : false
                    },

                    isReturn : {
                        type : Boolean,
                        default : false
                    },

                    orderTime : {
                        type : Date,
                        default : Date.now()
                    },

                    isDelivered : {
                        type : Boolean,
                        default : false
                    },


                    deliveredAt : {
                        type : Date,
                        default : null
                    }
                },
            ],
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

                lastName : {
                    type : String,
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
                },

                country : {
                    type : String,
                    required : true
                },

                state : {
                    type : String,
                    required : true
                },

                pinCode : {
                    type : String,
                    required : true
                }
            } 
        }
    ]

},{timestamps : true})

const Order = mongoose.model("Order", orderSchema)

export default Order