import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { allowNotification, sendNotification } from "../controllers/notification.controller.js"

const router = express.Router()

router.patch("/allowNotification", authentication, allowNotification)
router.post("/sendNotification", sendNotification)

export default router