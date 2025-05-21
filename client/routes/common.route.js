import express from "express"
import { getAllProduct, getAnnualReport, getBestSelling, getCarousel, getLimitedSaleProduct, getMember, getNewArrival, getProductByCategory, getProductBySubCategory, getSaleProduct, getSpecificProduct, getVariant, sale } from "../controllers/common.controller.js"

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
router.get("/getMember", getMember)
router.get("/getAnnualReport", getAnnualReport )
router.get("/getVariant/:productId", getVariant)


export default router