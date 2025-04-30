import express from "express"
import { getAllProduct, getNewArrival, getProductByCategory, getProductBySubCategory, getSpecificProduct } from "../controllers/common.controller.js"

const router = express.Router()

router.get("/getAllProduct",getAllProduct)
router.get("/getSpecificProduct/:productId", getSpecificProduct)
router.get("/getProductByCategory/:category", getProductByCategory)
router.get("/getProductBySubCategory/:subCategory", getProductBySubCategory)
router.get("/getNewArrival", getNewArrival)

export default router