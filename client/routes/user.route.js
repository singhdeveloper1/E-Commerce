import express from "express"
import {addUserAddress, deleteUserAddress, forgotPassword, getUserAddress, google, switchToSeller, updateUserAddress, updateUserData, updateUserPassword, userData, userLogin, userLogout, userRegister} from "../controllers/user.controller.js"
import { authentication } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", userRegister)
router.post("/login", userLogin)
router.post("/google", google)
router.patch("/forgotPassword", forgotPassword)
router.get("/getUserData", authentication, userData )
router.patch("/updateUserData", authentication,updateUserData)
router.patch("/updateUserPassword", authentication, updateUserPassword)
router.post("/addUserAddress", authentication, addUserAddress)
router.get("/getUserAddress", authentication, getUserAddress)
router.patch("/updateUserAddress/:id", authentication, updateUserAddress)
router.delete("/deleteUserAddress/:id", authentication, deleteUserAddress)
router.get("/logout", authentication, userLogout)

router.patch("/switchToSeller", authentication, switchToSeller)


export default router