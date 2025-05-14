import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import Review from "../models/review.model.js"
import Sale from "../models/sale.model.js"
import { errorHandler } from "../utils/errorHandler.js"
// import moment from "moment-timezone"


//! sale

export const sale = async (req, res, next)=>{
    // const {startTime, endTime, discount} = req.body
    const {startTime, endTime} = req.body

    const activeSale = await Sale.findOne()

        try {
            if(!activeSale){       
                const newSale = new Sale({
                    startTime,
                    endTime,
                    // discount
                })

                await newSale.save()
                res.status(200).json(newSale)
            }
        else{
            activeSale.startTime = startTime,
            activeSale.endTime = endTime
            activeSale.discount = discount

            await activeSale.save()
            res.status(200).json(activeSale)
        }
        } catch (error) {
            console.log("sale m h error", error)
            next(error)
        }
}

//! get All Product
export const getAllProduct = async (req, res, next)=>{
    try {
        const products = await Product.find()

        const ProductsWithRating = await Promise.all(products.map(async item=>{

            const reviews = await Review.find({productId : item._id})
            let ratedPerson = 0
            let averageRating = 0
            if(reviews.length && reviews.length > 0){
                    const total = reviews.reduce((sum,item)=>{
                       return sum + item.rating
                   },0)
                   averageRating = total/reviews.length
   
                    ratedPerson = reviews.length
               }
   
               return {
                   ...item.toObject(), averageRating, ratedPerson
               }
           }))

        // res.status(200).json(products)
        res.status(200).json(ProductsWithRating)
    } catch (error) {
        console.log("get all product common m h error", error)
        next(error)
    }
}

//! get Specific Product

export const getSpecificProduct = async (req, res, next)=>{
    try {
        const product = await Product.findById(req.params.productId)

             const reviews = await Review.find({productId : product._id})
            let ratedPerson = 0
            let averageRating = 0
            if(reviews.length && reviews.length > 0){
                    const total = reviews.reduce((sum,item)=>{
                       return sum + item.rating
                   },0)
                   averageRating = total/reviews.length
   
                    ratedPerson = reviews.length
               }

        // res.status(200).json(product)
        res.status(200).json({...product.toObject(), averageRating, ratedPerson})
    } catch (error) {
        console.log("get specific product common m h error", error)
        next(error)
    }
}

//! get product by category

export const getProductByCategory = async (req, res, next)=>{
    try {
        const product = await Product.find({category : req.params.category})

        if(!product) return next(errorHandler(404, "no product found for this sub category"))

            const ProductsWithRating = await Promise.all(product.map(async item=>{

                const reviews = await Review.find({productId : item._id})
                let ratedPerson = 0
                let averageRating = 0
                if(reviews.length && reviews.length > 0){
                        const total = reviews.reduce((sum,item)=>{
                           return sum + item.rating
                       },0)
                       averageRating = total/reviews.length
       
                        ratedPerson = reviews.length
                   }
       
                   return {
                       ...item.toObject(), averageRating, ratedPerson
                   }
               }))

        // res.status(200).json(product)
        res.status(200).json(ProductsWithRating)
    } catch (error) {
        console.log("get product by category m h error", error)
        next(error)
    }
}

//! get product by sub Category

export const getProductBySubCategory = async (req, res, next)=>{
    try {
        const product = await Product.find({subCategory : req.params.subCategory})
        if(!product) return next(errorHandler(404, "no product found for this subCategory"))

            const ProductsWithRating = await Promise.all(product.map(async item=>{

                const reviews = await Review.find({productId : item._id})
                let ratedPerson = 0
                let averageRating = 0
                if(reviews.length && reviews.length > 0){
                        const total = reviews.reduce((sum,item)=>{
                           return sum + item.rating
                       },0)
                       averageRating = total/reviews.length
       
                        ratedPerson = reviews.length
                   }
       
                   return {
                       ...item.toObject(), averageRating, ratedPerson
                   }
               }))

        // res.status(200).json(product)
        res.status(200).json(ProductsWithRating)
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

//! get sale product

export const getSaleProduct = async (req, res, next)=>{
    try {
        const activeForSale = await Product.find({sale : true})
        if(activeForSale.length == 0) return next(errorHandler(404, "no products are there in sale"))
        
            // const discount = await Sale.findOne()
            // const saleDiscount = discount.discount

            const ProductsWithRating = await Promise.all(activeForSale.map(async item=>{

                const reviews = await Review.find({productId : item._id})
                let ratedPerson = 0
                let averageRating = 0
                if(reviews.length && reviews.length > 0){
                        const total = reviews.reduce((sum,item)=>{
                           return sum + item.rating
                       },0)
                       averageRating = total/reviews.length
       
                        ratedPerson = reviews.length
                   }
       
                   return {
                       ...item.toObject(), averageRating, ratedPerson
                   }
               }))
        
        const activeSale = await Sale.findOne({endTime : {$lt : Date.now()}})
        if(activeSale) {
            activeForSale.forEach(async (product)=>{
                product.sale = false,
                product.discountPercentage = 0

                await product.save()
            })
            return next(errorHandler(404, "sale is no longer exist!!!"))
        }

            // res.status(200).json(activeForSale)
            res.status(200).json(ProductsWithRating)
       
        
    } catch (error) {
        console.log("get sale product m h error", error)
        next(error)
    }
}

//! get limited sale product

export const getLimitedSaleProduct = async (req, res, next)=>{
    try {
        const activeForSale = await Product.find({sale : true}).skip(0).limit(6)
        if(activeForSale.length == 0) return next(errorHandler(404, "no products are there in sale"))

        const ProductsWithRating = await Promise.all(activeForSale.map(async item=>{

         const reviews = await Review.find({productId : item._id})
         let ratedPerson = 0
         let averageRating = 0
         if(reviews.length && reviews.length > 0){
                 const total = reviews.reduce((sum,item)=>{
                    return sum + item.rating
                },0)
                averageRating = total/reviews.length

                 ratedPerson = reviews.length
            }

            return {
                ...item.toObject(), averageRating, ratedPerson
            }
        }))

        const activeSale = await Sale.findOne({endTime : {$lt : Date.now()}})

        if(activeSale){
            activeForSale.forEach(async (product)=>{
                product.sale = false,
                product.discountPercentage = 0
                await product.save()
            })

            return next(errorHandler(404, "sale is no longer exist!!!"))
        }

        res.status(200).json(ProductsWithRating)

        
    } catch (error) {
        console.log("get limited sale product m h error", error)
        next(error)
    }
}

//! get best selling

export const getBestSelling = async (req, res, next)=>{
    try {
        const order = await Order.aggregate([
            {
                $unwind :"$products"
            },
            {
                $group : {
                    _id : "$products.productId",
                    totalSold : {$sum : "$products.quantity"}
                }
            },
            {
                $sort : {totalSold : -1}
            },
            {
                $limit : 20
            },
            {
                $lookup : {
                    from : "products",
                    localField : "_id",
                    foreignField : "_id",
                    as : "product"
                }
            },
            {
                $unwind : "$product"
            },
            {
                $project : {_id : 0, product : 1}
            }
        ]) 

        res.status(200).json(order)

    } catch (error) {
        console.log("get best selling m h error", error)
        next(error)
    }
}