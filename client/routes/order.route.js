import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { cancelOrder, myOrder, placeOrder, viewCancelOrder } from "../controllers/order.controller.js"

const router = express.Router()

router.post("/placeOrder", authentication, placeOrder)
router.get("/myOrder", authentication, myOrder)
router.patch("/cancelOrder/:orderId/:productId", authentication, cancelOrder)
router.get("/viewCancelOrder", authentication, viewCancelOrder)

export default router