import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { myOrder, placeOrder } from "../controllers/order.controller.js"

const router = express.Router()

router.post("/placeOrder", authentication, placeOrder)
router.get("/myOrder", authentication, myOrder)

export default router