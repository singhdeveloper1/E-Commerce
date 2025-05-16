import Carousel from "../models/carousel.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import uploadToClodinary from "./clodinary.controller.js"

//! add carousel
export const addCarousel = async (req, res, next)=>{
    const {title, subTitle, link, isActive} = req.body

    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!!"))

    try {
        let imageUrl = ""
        if(req.file){
            const result = await uploadToClodinary(req, "Carousel_Image", next)
            imageUrl = result.secure_url
        }
  
        const newCarousel = new Carousel({
            image : imageUrl,
            title,
            subTitle,
            link,
            isActive
        })

        await newCarousel.save()

        res.status(200).json("Carousel added successfully!!!")

    } catch (error) {
        console.log("add carousel m h error", error)
        next(error)
    }
}

//! update carousel

export const updateCarousel = async (req, res, next)=>{
    const {title, subTitle, link, isActive} = req.body

    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!"))

        const carousel = await Carousel.findById(req.params.carouselId)

        let imageUrl = ""

        if(req.file){
            const result = await uploadToClodinary(req, "Carousel_image", next)
            imageUrl = result.secure_url
        }

        if(imageUrl.length ==0){
            imageUrl = carousel.image
        }

        try {
            await Carousel.findByIdAndUpdate(req.params.carouselId,{
                image : imageUrl,
                title,
                subTitle,
                link,
                isActive
            },{new : true})            

            res.status(200).json("carousel updated successfully!!")
        } catch (error) {
            console.log("update carousel m h error", error)
            next(error)
        }
}

//! delete carousel

export const deleteCarousel = async (req, res, next)=>{
    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!"))
    try {
        await Carousel.findByIdAndDelete(req.params.carouselId)

        res.status(200).json("carousel deleted successfully!!!")
    } catch (error) {
        console.log("delete carousel m h error", error)
        next(error)
    }
}

//! get specific carousel

export const getSpecificCarousel = async (req, res, next)=>{
    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!"))

        try {
            const carousel = await Carousel.findById(req.params.carouselId)
            res.status(200).json(carousel)
        } catch (error) {
            console.log("get specific carousel m h error", errro)
            next(error)
        }
}