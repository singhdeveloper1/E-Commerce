import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { makeContact, viewContact } from "../controllers/contact.controller.js"

const router = express.Router()

router.post("/makeContact", authentication, makeContact)
router.get("/viewContact", authentication, viewContact)


export default router