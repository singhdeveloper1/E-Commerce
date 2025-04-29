import express from "express"
import { getAllProduct, getSpecificProduct } from "../controllers/common.controller.js"

const router = express.Router()

router.get("/getAllProduct",getAllProduct)
router.get("/getSpecificProduct/:productId", getSpecificProduct)

export default router