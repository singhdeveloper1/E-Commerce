import Coupon from "../models/coupon.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import moment from "moment-timezone"


//! create coupon
export const createCoupon = async (req, res, next)=>{
    const {coupon, discountType, discountValue, expiresAt} = req.body

    const istDate = new Date(expiresAt)
    istDate.setHours(istDate.getHours()-5, istDate.getMinutes()- 30)



    const existingCoupon = await Coupon.findOne({coupon})

    if(existingCoupon) return next(errorHandler(400, "coupon already exist!!!"))

        const newCoupon = new Coupon({
            coupon,
            discountType,
            discountValue,
            expiresAt : istDate
        })
        try {
            await coupon.save()
            res.status(200).json("coupon created successfully!!!", newCoupon)
        } catch (error) {
            console.log("create coupon m h error", error)
            next(error)
        }
}

//! apply coupon

export const applyCoupon = async (req, res, next)=>{
    const {coupon, totalPrice} = req.body

    try {
        const existingCoupon = await Coupon.findOne({coupon})

        if(!existingCoupon) return next(errorHandler(404, "Coupon does not exist"))

            if(existingCoupon.expiresAt < new Date) return errorHandler(400, "Coupon was expired...")

                if(existingCoupon.usedBy.includes(req.user._id)) return next(errorHandler(400, "you already used this coupon"))

                    let discountedPrice = ""

                    if(existingCoupon.discountType === "Percentage"){
                        let TotalDiscount = totalPrice * existingCoupon.discountValue/100
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