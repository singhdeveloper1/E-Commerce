import Review from "../models/review.model.js"
import { errorHandler } from "../utils/errorHandler.js"

//! write review
export const writeReview = async (req, res, next)=>{
    const {rating, comment} = req.body

    try {
    if(!rating) return next(errorHandler(400, "please rate between 1 to 5"))

        const review = await Review.findOne({userId : req.user._id, productId : req.params.productId})

        if(review){
            review.rating = rating,
            review.comment = comment

            await review.save()
            res.status(200).json({msg : "review updated successfully!!" , review})
        }

        else{
            const newReview = new Review({
                userId : req.user._id,
                productId : req.params.productId,
                rating,
                comment
            })
            
                await newReview.save()
                res.status(200).json({msg : "review added successfully ", newReview})
        }


    } catch (error) {
        console.log("add review m h error", error)
        next(error)
    }
}

//! view specific review

export const mySeperateReview = async(req, res, next)=>{
    try {
        const review = await Review.find({userId : req.user._id, productId : req.params.productId}).populate("productId")

        if(!review) return next(errorHandler(400, "no reviews found!"))

            res.status(200).json(review)

    } catch (error) {
        console.log("view specific review m h error", error)
        next(error)
    }
}

//! my reviews

export const myReviews = async (req, res, next)=>{
    try {
        const myReviews = await Review.find({userId : req.user._id}).populate("productId")

        if(!myReviews) return next(errorHandler(400, "no reviews found!!"))
            
        res.status(200).json(myReviews)
    } catch (error) {
        console.log("my reviews m h error", error)
        next(error)
    }
}