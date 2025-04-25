import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { addToWishlist, deleteFullWishlist, deleteOneWishlist, getWishlist } from "../controllers/wishlist.controller.js"

const router = express.Router()

router.post("/addToWishlist/:productId", authentication, addToWishlist)
router.get("/viewWishlist", authentication, getWishlist)
router.delete("/deleteOneWishlist/:productId", authentication, deleteOneWishlist)
router.delete("/deleteFullWishlist", authentication, deleteFullWishlist)

export default router