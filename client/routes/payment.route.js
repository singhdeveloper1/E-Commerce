import express from "express"
import { order } from "../controllers/payment.controller.js"

const router = express.Router()

router.post("/order", order)
// router.post("/verification", paymentVerification)

export default router