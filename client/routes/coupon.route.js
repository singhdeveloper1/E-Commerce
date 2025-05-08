import express from "express"
import { applyCoupon, createCoupon } from "../controllers/coupon.controller.js"
import { authentication } from "../middlewares/auth.middleware.js"


const router = express.Router()

router.post("/createCoupon",createCoupon)
router.post("/applyCoupon", authentication, applyCoupon)

export default router