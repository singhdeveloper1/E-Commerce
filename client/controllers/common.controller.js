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

//! get product by category

export const getProductByCategory = async (req, res, next)=>{
    try {
        const product = await Product.find({category : req.params.category})

        res.status(200).json(product)
    } catch (error) {
        console.log("get product by category m h error", error)
        next(error)
    }
}

//! get product by sub Category

export const getProductBySubCategory = async (req, res, next)=>{
    try {
        const product = await Product.find({subCategory : req.params.subCategory})
        res.status(200).json(product)
    } catch (error) {
        console.log("get product by subcategory m h error", error)
        next(error)
    }
}

//! get new Arrival

export const getNewArrival = async (req, res, next)=>{
    try {
        const product = await Product.find().sort({createdAt : -1}).limit(5)

        res.status(200).json(product)

        // const groupByCategory = {}
        // product.forEach((item)=>{
        //     if(!groupByCategory[item.category]){
        //         groupByCategory[item.category] = []
        //     }
        //     groupByCategory[item.category].push(item)
        // })
        // res.status(200).json(groupByCategory)
    } catch (error) {
        console.log("get new Arrival m h error", error)
        next(error)
    }
}