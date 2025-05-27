import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { cancelOrder, myOrder, placeOrder, returnOrder, viewCancelOrder, viewReturnOrder } from "../controllers/order.controller.js"

const router = express.Router()

router.post("/placeOrder", authentication, placeOrder)
router.get("/myOrder", authentication, myOrder)
router.patch("/cancelOrder/:orderId/:productId", authentication, cancelOrder)
router.get("/viewCancelOrder", authentication, viewCancelOrder)
router.patch("/returnOrder/:orderId/:productId", authentication, returnOrder)
router.get("/viewReturnOrder", authentication, viewReturnOrder)

export default router