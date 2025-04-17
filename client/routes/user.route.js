import express from "express"
import { userData, userLogin, userRegister } from "../controllers/user.controller.js"
import { authentication } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/register", userRegister)
router.post("/login", userLogin)
router.get("/userData", authentication, userData )


export default router