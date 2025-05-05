import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import { errorHandler } from "../utils/errorHandler.js"


//! place order
export const placeOrder = async (req, res, next)=>{
    try {

        const cartItems = req.body.products        

        const products = await Promise.all(
            cartItems.map(async (item)=>{
                const product = await Product.findById(item.productId)

                if(!product) return next(errorHandler(404, "product not found"))

                    return {
                        productId : product._id,
                        name : product.productImage,
                        image : product.productImage,
                        price : product.productPrice,
                        variant :{
                            size : item.size,
                            color : item.color
                        },
                        quantity : item.quantity
                    }
            })
        )

        const orderedProduct = new Order({
            userId : req.user._id,
            products : products,
            payment : req.body.payment,
            address : {
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                company : req.body.company,
                street : req.body.street,
                apartment : req.body.apartment,
                city : req.body.city,
                phone : req.body.phone,
                email : req.body.email,
                country : req.body.country,
                state : req.body.state,
                pinCode : req.body.pinCode
            }
        })

        await orderedProduct.save()

         res.status(200).json(orderedProduct)

    } catch (error) {
        console.log("place order m h error", error)
        next(error)
    }
}


//! my order
export const myOrder = async (req, res, next)=>{
    try {
        const orders = await Order.find({userId : req.user._id})
        if(!orders) return next(errorHandler(404, "nothing in cart"))

            res.status(200).json(orders)
    } catch (error) {
        console.log("my order m h error", error)
        next(error)
    }
}