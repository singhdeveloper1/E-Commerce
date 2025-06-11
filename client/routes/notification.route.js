import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { disableNotification, sendNotification, enableNotification } from "../controllers/notification.controller.js"

const router = express.Router()

router.patch("/enableNotification", authentication, enableNotification)
router.patch("/disableNotification", authentication, disableNotification)
router.post("/sendNotification", sendNotification)

export default router