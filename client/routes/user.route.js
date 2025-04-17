import express from "express"
import { getUserAddress, updateUserData, userAddress, userData, userLogin, userRegister } from "../controllers/user.controller.js"
import { authentication } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/getUserData", authentication, userData )
router.put("/updateUserData", authentication,updateUserData)
router.post("/userAddress", authentication, userAddress)
router.get("/getUserAddress", authentication, getUserAddress)


export default router