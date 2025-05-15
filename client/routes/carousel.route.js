import express from "express"
import { authentication } from "../middlewares/auth.middleware.js"
import uploadLocal from "../middlewares/uploadLocal.middleware.js"
import { addCarousel, deleteCarousel, getSpecificCarousel, updateCarousel } from "../controllers/carousel.controller.js"

const router = express.Router()

router.post("/addCarousel", authentication, uploadLocal.single("image"), addCarousel)
router.patch("/updateCarousel/:carouselId", authentication,uploadLocal.single("image"), updateCarousel)
router.delete("/deleteCarousel/:carouselId", authentication, deleteCarousel)
router.get("/getSpecificCarousel/:carouselId", authentication, getSpecificCarousel)

export default router