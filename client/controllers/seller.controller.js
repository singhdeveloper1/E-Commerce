import Product from "../models/product.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import uploadToClodinary from "./clodinary.controller.js"

//! switch to user

export const switchToUser = async (req, res, next)=>{
    try {
        await User.findByIdAndUpdate(req.user._id,{
            isSeller : false
        },{new : true})

        res.status(200).json("switched to user successfully!!!")
    } catch (error) {
        console.log("switch to user m h error", error)
        next(error)
    }
}

//! add product

export const addproduct = async (req, res, next)=>{
    const {productName, productPrice, discountPercentage} = req.body

    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!!"))

    let imageUrl = ""

    if(req.file){
        // const result = await uploadToClodinary(req.file.path, "Product_Image")
        const result = await uploadToClodinary(req, "Product_Image",next)
        imageUrl = result.secure_url
    }

    // let discountedPrice = ""

    // if(discountPercentage){
    //     let TotalDiscount = actualPrice * (discount/100)
    //     discountedPrice = actualPrice - TotalDiscount
    // }
    // if(!discountPercentage){
    //     discountPercentage = undefined
    // }


 
    const newProduct = new Product({
        productName,
        productImage : imageUrl, 
        productPrice, 
        // discountedPrice,
        discountPercentage,
        seller : req.user._id
    })

    try {
        await newProduct.save()
        res.status(201).json(newProduct)
    } catch (error) {
        console.log("add product m h error", error)
        next(error)
    }

}

