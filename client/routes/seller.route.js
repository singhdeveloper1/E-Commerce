import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { switchToUser } from "../controllers/seller.controller.js"

const router = express.Router()

router.patch("/switchToUser", authentication, switchToUser)

export default router