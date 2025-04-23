import express from "express"
import { addToCart, deleteUserAddress, forgotPassword, getUserAddress, google, switchToSeller, updateCartQuantity, updateUserAddress, updateUserData, updateUserPassword, userAddress, userData, userLogin, userLogout, userRegister, viewCart } from "../controllers/user.controller.js"
import { authentication } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", userRegister)
router.post("/login", userLogin)
router.post("/google", google)
router.patch("/forgotPassword", forgotPassword)
router.get("/getUserData", authentication, userData )
router.patch("/updateUserData", authentication,updateUserData)
router.patch("/updateUserPassword", authentication, updateUserPassword)
router.post("/userAddress", authentication, userAddress)
router.get("/getUserAddress", authentication, getUserAddress)
router.patch("/updateUserAddress/:id", authentication, updateUserAddress)
router.delete("/deleteUserAddress/:id", authentication, deleteUserAddress)
router.get("/logout", authentication, userLogout)

router.patch("/switchToSeller", authentication, switchToSeller)

router.post("/addToCart/:productId", authentication, addToCart)
router.get("/viewCart", authentication, viewCart )
router.patch("/updateCartQuantity/:productId" , authentication, updateCartQuantity)


export default router