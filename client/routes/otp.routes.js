import express from "express"
import { getOTP, verifyOTP } from "../controllers/otp.controller.js"

const router = express.Router()

router.post("/getOTP", getOTP)
router.post("/verifyOTP",verifyOTP)


export default router