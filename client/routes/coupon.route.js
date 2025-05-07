import express from "express"
import { createCoupon } from "../controllers/coupon.controller.js"


const router = express.Router()

router.post("/createCoupon",createCoupon)
export default router