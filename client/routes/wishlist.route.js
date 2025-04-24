import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { addToWishlist, getWishlist } from "../controllers/wishlist.controller.js"

const router = express.Router()

router.post("/addToWishlist/:productId", authentication, addToWishlist)
router.get("/getWishlist", authentication, getWishlist)

export default router