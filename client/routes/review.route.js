import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import { deleteSeperateReview, myReviews, mySeperateReview, writeReview } from "../controllers/review.controller.js"

const router = express.Router()

router.post("/writeReview/:productId", authentication, writeReview)
router.get("/mySeperateReview/:productId", authentication, mySeperateReview)
router.get("/myReviews", authentication, myReviews)
router.delete("/deleteSeperateReview/:productId", authentication, deleteSeperateReview)

export default router