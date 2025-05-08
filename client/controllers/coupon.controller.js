import Coupon from "../models/coupon.model.js"
import Order from "../models/order.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import moment from "moment-timezone"


//! create coupon
export const createCoupon = async (req, res, next)=>{
    const {coupon, discountType, discountValue, expiresAt, isForNewUser, validProducts, validCategories} = req.body

    const istDate = new Date(expiresAt)
    istDate.setHours(istDate.getHours()-5, istDate.getMinutes()- 30)



    const existingCoupon = await Coupon.findOne({coupon})

    if(existingCoupon) return next(errorHandler(400, "coupon already exist!!!"))

        const newCoupon = new Coupon({
            coupon,
            discountType,
            discountValue,
            expiresAt : istDate,
            validProducts,
            validCategories,
            isForNewUser
        })
        try {
            await newCoupon.save()
            res.status(200).json("coupon created successfully!!!", newCoupon)
        } catch (error) {
            console.log("create coupon m h error", error)
            next(error)
        }
}

//! apply coupon

export const applyCoupon = async (req, res, next)=>{
    const {coupon, totalPrice,cartItems} = req.body

    try {
                const existingCoupon = await Coupon.findOne({coupon})

        if(!existingCoupon) return next(errorHandler(404, "Coupon does not exist"))

            if(existingCoupon.expiresAt < new Date()) return next(errorHandler(400, "Coupon was expired..."))

                if(existingCoupon.usedBy.includes(req.user._id)) return next(errorHandler(400, "you already used this coupon"))

                    const previousOrder = await Order.find({userId : req.user._id})
                     
                    if(existingCoupon.isForNewUser && previousOrder.length > 0) return next(errorHandler(400, "This coupon is only valid for first order..."))


                        //! based on product and cayegoty

                        let eligibleItems = cartItems

                        const validProductAndCategory = existingCoupon.validProducts && existingCoupon.validProducts.length > 0 || existingCoupon.validCategories && existingCoupon.validCategories.length > 0
                         
                        if(validProductAndCategory){
                            eligibleItems = cartItems.filter(item=>{
                                const productMatch = existingCoupon.validProducts.some(list => list == item.productId)
                                const categoryMatch = existingCoupon.validCategories.includes(item.category)

                                return productMatch || categoryMatch
                            })

                            if(eligibleItems.length == 0) return next(errorHandler(400, "this coupon is only valid for specifc products or sprcific category!!!"))
                        }

                        let eligibleTotal = eligibleItems.reduce((sum, item)=>{
                            // return (sum + item.price )* item.quantity
                            let add = sum + item.price
                            // console.log(add*item)
                            return add*item.quantity
                        },0)



                    let discountedPrice = ""

                    if(existingCoupon.discountType === "Percentage"){
                        // let TotalDiscount = totalPrice * existingCoupon.discountValue/100
                        let TotalDiscount = eligibleTotal * existingCoupon.discountValue/100
                        discountedPrice = totalPrice - TotalDiscount
                    }
                    else{
                        discountedPrice = totalPrice - existingCoupon.discountValue
                    }

                    existingCoupon.usedBy.push(req.user._id)
                    await existingCoupon.save()

                    res.status(200).json(discountedPrice)


    } catch (error) {
        console.log("apply coupon m h error", error)
        next(error)
    }
}