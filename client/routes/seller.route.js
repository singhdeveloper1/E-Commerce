import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { addproduct, getProduct, switchToUser, updateProduct } from "../controllers/seller.controller.js"
import uploadLocal from "../middlewares/uploadLocal.middleware.js"

const router = express.Router()

router.patch("/switchToUser", authentication, switchToUser)
router.post("/addproduct", authentication,uploadLocal.single("file"), addproduct)
router.get("/getProduct", authentication , getProduct)
router.patch("/updateProduct/:id", authentication, updateProduct)

export default router