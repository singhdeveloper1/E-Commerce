import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { cancelledOrder, myOrder, placeOrder } from "../controllers/order.controller.js"

const router = express.Router()

router.post("/placeOrder", authentication, placeOrder)
router.get("/myOrder", authentication, myOrder)
router.get("/cancelledOrder", authentication, cancelledOrder)

export default router