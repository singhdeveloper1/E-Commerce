import express from "express"
import { addToCart, deleteFullCart, deleteOneCart, updateCartQuantity, viewCart } from "../controllers/cart.controller.js"
import { authentication } from "../middlewares/auth.middleware.js"

const router = express.Router()

// router.post("/addToCart/:productId", authentication, addToCart)
router.post("/addToCart/:productId", addToCart)
router.get("/viewCart", authentication, viewCart)
// router.patch("/updateCartQuantity/:productId" , authentication, updateCartQuantity)
router.patch("/updateCartQuantity" , authentication, updateCartQuantity)
router.delete("/deleteOneCart/:productId", authentication, deleteOneCart)
router.delete("/deleteFullCart", authentication, deleteFullCart)

export default router