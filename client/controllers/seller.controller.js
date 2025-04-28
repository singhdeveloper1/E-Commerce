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
    const {productName, productPrice, discountPercentage, productDescription, productColor, productSize} = req.body

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
        productDescription,
        productSize,
        productColor,
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

//! get product

export const getProduct = async (req, res, next)=>{
    if(!req.user.isSeller) return next(errorHandler(401, "You are not a seller"))

        try {
            const products = await Product.find({seller : req.user._id})

            res.status(200).json(products)
        } catch (error) {
            console.log("get product m h error", error)
            next(error)
        }
}

//! updateProduct

export const updateProduct = async (req, res, next)=>{
    const {productName, productPrice, discountPercentage, productDescription, productColor, productSize} = req.body

    try {
        if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller"))

        let imageUrl = ""

        if(req.file){
            const result = await uploadToClodinary(req, "Product_Image", next)
            imageUrl = result.secure_url

            await Product.findByIdAndUpdate(req.params.id,{
                productName,
                productPrice,
                discountPercentage,
                productColor,
                productDescription,
                productSize,
                productImage : imageUrl
            },{new : true})
        }

        else{
        await Product.findByIdAndUpdate(req.params.id,{
            productName,
            productPrice,
            discountPercentage,
            productDescription,
            productSize,
            productColor
        },{new : true})
    }

        res.status(200).json("product updated successfully!!!")
 
        } catch (error) {
            console.log("update product m h error", error)            
            next(error)
        }
}

//! delete Product

export const deleteProduct = async (req, res, next)=>{
    try {
        if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller"))
            await Product.findByIdAndDelete(req.params.id)

        res.status(200).json("product successfully deleted!!!")
    } catch (error) {
        console.log("delete product m h error", error)
        next(error)
    }
}

//! delete all product

export const deleteAllProduct = async (req, res, next)=>{
    try {
        if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller"))

            await Product.deleteMany({seller : req.user._id})

            res.status(200).json("successfully deleted all products!!")
        
    } catch (error) {
        console.log("delete all product m h error", error)
        next(error)
    }
}
