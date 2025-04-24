import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { writeReview } from "../controllers/review.controller.js"

const router = express.Router()

router.post("/writeReview/:productId", authentication, writeReview)

export default router