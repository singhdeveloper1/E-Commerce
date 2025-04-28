import Product from "../models/product.model.js"

//! get All Product
export const getAllProduct = async (req, res, next)=>{
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.log("get all product common m h error", error)
        next(error)
    }
}

//! get Specific Product

export const getSpecificProduct = async (req, res, next)=>{
    try {
        const product = await Product.findById(req.params.productId)
        res.status(200).json(product)
    } catch (error) {
        console.log("get specific product common m h error", error)
        next(error)
    }
}