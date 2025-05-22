import Carousel from "../models/carousel.model.js"
import Member from "../models/member.model.js"
import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import Review from "../models/review.model.js"
import Sale from "../models/sale.model.js"
import User from "../models/user.model.js"
import Variant from "../models/variant.model.js"
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

                       const products = {
                        productId : product._id,
                        title : product.productName,
                        image : product.productImage,
                        price : product.productPrice,
                        description : product.productDescription,
                        size : product.productSize,
                        color : product.productColor,
                        category : product.category,
                        subCategory : product.subCategory,
                        averageRating,
                        ratedPerson
         // totalPrice : product.productPrice * item.quantity
   }
        // res.status(200).json(product)
        // res.status(200).json({...product.toObject(), averageRating, ratedPerson})
        res.status(200).json(products)
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
        const product = await Product.aggregate([
            {
                $sort : {createdAt : -1}
            },
            {
                $group : {
                    _id : "$category",
                    latestProducts : {$push : "$$ROOT"}
                }
            },
            {
                $lookup : {
                    from : "categoryimages",
                    localField : "_id",
                    foreignField : "category",
                    as : "categoryImage"
                }
            },
            {
                $unwind : "$categoryImage"
            },
            {
                $project : {
                    _id : 0,
                    category : "$_id",
                    image : "$categoryImage.image",
                    products : {$slice : ["$latestProducts", 20]}
                }
            },
            {
                $limit : 5
            }
        ])

       const result = {};
       product.forEach((item) => {
         result[item.category] = {
           image: item.image,
           products: item.products,
         };
       });

        res.status(200).json(result)
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

        //! for rating

        const ProductsWithRating = await Promise.all(order.map(async item=>{

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
                // ...item.toObject(), averageRating, ratedPerson
                ...item, averageRating, ratedPerson
            }
        }))
        res.status(200).json(ProductsWithRating)

    } catch (error) {
        console.log("get best selling m h error", error)
        next(error)
    }
}

//! get carousel

export const getCarousel = async (req, res, next)=>{
    try {
        const carousel = await Carousel.find()

        res.status(200).json(carousel)
       
    } catch (error) {
        console.log("get carousel m h error", error)
        next(error)
    }
}

//! get Member

export const getMember = async (req, res, next)=>{
    try {
        const member = await Member.find()
        res.status(200).json(member)
    } catch (error) {
        console.log("get member m h error", error)
        next(error)
    }
}

//! get annual Report

export const getAnnualReport = async (req, res, next)=>{
    try {
     const thirtyDayAgo = new Date()
     thirtyDayAgo.setDate(thirtyDayAgo.getDate()-30)

     const oneYearAgo = new Date()
     oneYearAgo.setFullYear(oneYearAgo.getFullYear()-1)

     const activeUser = await Order.aggregate([
        {
            $match : {createdAt : {$gte : thirtyDayAgo}}
        },
        {
            $group : {
                _id : "$userId"
            }
        },
        {
            $count : "activeUser"
        }
    ])

    const activeSeller = await Order.aggregate([
        {
            $match : {createdAt : {$gte : thirtyDayAgo}}
        },
        {
            $unwind : "$products"
        },
        {
            $lookup : {
                from : "products",
                localField : "products.productId",
                foreignField : "_id",
                as : "productDetails"
            }
        },
        {
            $unwind : "$productDetails"
        },
        {
            $group : {
                _id : null,
                activeSellers : {
                    $addToSet : "$productDetails.seller",
                },
                monthlyProductSale : {
                    $sum : 1
                }
            }
        },
        {
            $project : {
                _id : 0,
                activeSellers : {$size : "$activeSellers"},
                monthlyProductSale : 1
            }
        }
    ])

    const grossSale = await Order.aggregate([
        {
            $match : {createdAt : {$gte : oneYearAgo}}
        },
        {
            $unwind : "$products"
        },
        {
            $project : {
                lineTotal : {
                    $multiply : ["$products.price", "$products.quantity"]
                }
            }
        },
        {
            $group : {
                _id : null,
                annualGross : {$sum : "$lineTotal"}
            }
        },
        {
            $project : {
                _id : 0,
                annualGross : 1
            }
        }
    ])

    const activeUsers = activeUser[0]?.activeUser || 0;
    const {activeSellers = 0, monthlyProductSale = 0} = activeSeller[0]
    const annualGrossSale = grossSale[0]?.annualGross || 0

    res.status(200).json({activeSellers, monthlyProductSale, activeUsers, annualGrossSale})
    } catch (error) {
        console.log("get annual report m h error", error )
        next(error)
    }
}

//! get variant

export const getVariant = async (req, res, next)=>{
    const {size, color} = req.body

    try {
        const variant = await Variant.findOne({productId : req.params.productId, size, color})        
        res.status(200).json(variant)
    } catch (error) {
        console.log("get variant m h error", error)
        next(error)
    }
}

//! get filtered Products

export const getFilteredProducts = async (req, res, next)=>{
    const {search, category, subCategory, size,  color, minPrice, maxPrice, page=1, limit=3 }  = req.query
    try {
        const query = {};

        if (search) {
          query.$or = [
            { productName: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { subCategory: { $regex: search, $options: "i" } },
          ];
        }

        if (category) query.category = category;
        if (subCategory) query.subCategory = subCategory;

        if (maxPrice || minPrice) {
          query.productPrice = {};
          if (minPrice) query.productPrice.$gte = Number(minPrice);
          if (maxPrice) query.productPrice.$lte = Number(maxPrice);
        }

        const skip = (page - 1) * limit;

        const product = await Product.find(query).skip(skip).limit(limit);

    if(product.length == 0){
        res.status(404).json("no product is found for the selected page or filters!!")
    }

    // const total = await Product.countDocuments(query)

    res.status(200).json(product)
    } catch (error) {
        console.log("get filtered product m h error", error)
        next(error)
    }
}