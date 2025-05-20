import express from "express"
import { getDetails } from "../controllers/dashboard.controller.js"

const router = express.Router()

router.get("/getDetails", getDetails)

export default router