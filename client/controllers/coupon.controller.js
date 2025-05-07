import Coupon from "../models/coupon.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import moment from "moment-timezone"

export const createCoupon = async (req, res, next)=>{
    const {code, discountType, discountValue, expiresAt} = req.body

    const istDate = new Date(expiresAt)
    istDate.setHours(istDate.getHours()-5, istDate.getMinutes()- 30)



    const existingCoupon = await Coupon.findOne({code})

    if(existingCoupon) return next(errorHandler(400, "coupon already exist!!!"))

        const coupon = new Coupon({
            code,
            discountType,
            discountValue,
            expiresAt : istDate
        })
        try {
            await coupon.save()
            res.status(200).json("coupon created successfully!!!", coupon)
        } catch (error) {
            console.log("create coupon m h error", error)
            next(error)
        }
}