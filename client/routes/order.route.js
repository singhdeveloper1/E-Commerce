import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { placeOrder } from "../controllers/order.controller.js"

const router = express.Router()

router.post("/placeOrder", authentication, placeOrder)

export default router