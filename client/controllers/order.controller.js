import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import { errorHandler } from "../utils/errorHandler.js"


//! place order
export const placeOrder = async (req, res, next)=>{

    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body
    try {

        const cartItems = req.body.products        
        // let cartItems = req.body.products        

        // if(!Array.isArray(cartItems)){
        //     cartItems = [cartItems]
        // }

        const products = await Promise.all(
            cartItems.map(async (item)=>{
                const product = await Product.findById(item.productId)

                if(!product) return next(errorHandler(404, "product not found"))

                    return {
                        productId : product._id,
                        title : product.productName,
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

        //! if payment method is Bank

        let paymentVerified = false
        let paymentStatus = pending

        if(req.body.payment == "Bank"){
                const body = razorpay_order_id + "|" + razorpay_payment_id
            
                const expectedSignature =  crypto.createHmac("sha256", "razorpay_key_secret")
                                                 .update(body.toString())                           
                                                 .digest("hex")
            
                    if(expectedSignature === razorpay_signature){
            
                        paymentStatus = "Paid",
                        paymentVerified = true
            
                        res.json("payment verified successfull")
                    }
                    else{
                        return next(errorHandler(400, "Payment Verification Failed!!!"))
                    }
        }

        const orderedProduct = new Order({
            userId : req.user._id,
            products : products,
            // payment : req.body.payment,
            payment : {
                method : req.body.payment,
                status : paymentStatus,
                paymentId : razorpay_payment_id,
                orderId : razorpay_order_id
            },
            // address : {
            //     firstName : req.body.firstName,
            //     lastName : req.body.lastName,
            //     company : req.body.company,
            //     street : req.body.street,
            //     apartment : req.body.apartment,
            //     city : req.body.city,
            //     phone : req.body.phone,
            //     email : req.body.email,
            //     country : req.body.country,
            //     state : req.body.state,
            //     pinCode : req.body.pinCode
            // }

            address : req.body.address
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