import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { viewSpecificReview, writeReview } from "../controllers/review.controller.js"

const router = express.Router()

router.post("/writeReview/:productId", authentication, writeReview)
router.get("/viewSpecificReview/:productId", authentication, viewSpecificReview)

export default router