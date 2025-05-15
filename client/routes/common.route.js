import express from "express"
import { getAllProduct, getBestSelling, getCarousel, getLimitedSaleProduct, getNewArrival, getProductByCategory, getProductBySubCategory, getSaleProduct, getSpecificProduct, sale } from "../controllers/common.controller.js"

const router = express.Router()

router.post("/sale", sale)

router.get("/getAllProduct",getAllProduct)
router.get("/getSpecificProduct/:productId", getSpecificProduct)
router.get("/getProductByCategory/:category", getProductByCategory)
router.get("/getProductBySubCategory/:subCategory", getProductBySubCategory)
router.get("/getNewArrival", getNewArrival)
router.get("/getSaleProduct", getSaleProduct)
router.get("/getLimitedSaleProduct", getLimitedSaleProduct)
router.get("/getBestSelling", getBestSelling)
router.get("/getCarousel", getCarousel)

export default router