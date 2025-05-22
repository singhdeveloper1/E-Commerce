import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { addCategoryImage, addForSale, addproduct, addVariant, deleteAllProduct, deleteProduct, deleteVariant, getCategoryImage, getProduct, getVariants, switchToUser, updateCategoryImage, updateProduct } from "../controllers/seller.controller.js"
import uploadLocal from "../middlewares/uploadLocal.middleware.js"

const router = express.Router()

router.patch("/switchToUser", authentication, switchToUser)
router.post("/addproduct", authentication,uploadLocal.single("image"), addproduct)
router.get("/getProduct", authentication , getProduct)
router.patch("/updateProduct/:productId", authentication, uploadLocal.single("image"), updateProduct)
router.delete("/deleteProduct/:productId", authentication, deleteProduct)
router.delete("/deleteAllProduct", authentication, deleteAllProduct)
router.post("/addCategoryImage", authentication, uploadLocal.single("image"), addCategoryImage)
router.get("/getCategoryImage", authentication, getCategoryImage)
router.patch("/updateCategoryImage/:id", authentication, uploadLocal.single("image"), updateCategoryImage )
router.post("/addVariant/:productId", authentication, addVariant)
router.get("/getVariants/:productId", authentication, getVariants)
router.delete("/deleteVariant/:variantId", authentication, deleteVariant)

router.patch("/addForSale/:productId", authentication, addForSale)

export default router