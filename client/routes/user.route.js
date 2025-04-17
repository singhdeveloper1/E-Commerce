import express from "express"
import { getUserAddress, google, updateUserAddress, updateUserData, updateUserPassword, userAddress, userData, userLogin, userRegister } from "../controllers/user.controller.js"
import { authentication } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", userRegister)
router.post("/login", userLogin)
router.post("/google", google)
router.get("/getUserData", authentication, userData )
router.patch("/updateUserData", authentication,updateUserData)
router.patch("/updateUserPassword", authentication, updateUserPassword)
router.post("/userAddress", authentication, userAddress)
router.get("/getUserAddress", authentication, getUserAddress)
router.patch("/updateUserAddress/:id", authentication, updateUserAddress)


export default router