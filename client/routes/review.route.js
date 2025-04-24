import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { myReviews, mySeperateReview, writeReview } from "../controllers/review.controller.js"

const router = express.Router()

router.post("/writeReview/:productId", authentication, writeReview)
router.get("/mySeperateReview/:productId", authentication, mySeperateReview)
router.get("/myReviews", authentication, myReviews)

export default router