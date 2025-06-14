import mongoose from "mongoose"
import Order from "../models/order.model.js"
import Review from "../models/review.model.js"
import { errorHandler } from "../utils/errorHandler.js"

//! write review
export const writeReview = async (req, res, next) => {
  const { rating, comment } = req.body;

  try {
    const result = await Order.aggregate([
      {
        $match: { userId: req.user._id },
      },
      {
        $unwind: "$orders",
      },
      {
        $unwind: "$orders.products",
      },
      {
        $match: {
          "orders.products.productId": new mongoose.Types.ObjectId(
            String(req.params.productId)
          ),
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (result.length == 0)
      return next(
        errorHandler(401, "You only allowed to review on purchased product")
      );

    if (!rating) return next(errorHandler(400, "please rate between 1 to 5"));
    const review = await Review.findOne({
      userId: req.user._id,
      productId: req.params.productId,
    });

    if (review) {
      (review.rating = rating), (review.comment = comment);

      await review.save();
      res.status(200).json({ msg: "review updated successfully!!", review });
    } else {
      const newReview = new Review({
        userId: req.user._id,
        productId: req.params.productId,
        rating,
        comment,
      });

      await newReview.save();
      res.status(200).json({ msg: "review added successfully ", newReview });
    }
  } catch (error) {
    console.log("add review m h error", error);
    next(error);
  }
};

//! view specific/seperate review

export const mySeperateReview = async (req, res, next) => {
  try {
    const review = await Review.find({
      userId: req.user._id,
      productId: req.params.productId,
    }).populate("productId");

    if (!review) return next(errorHandler(400, "no reviews found!"));

    res.status(200).json(review);
  } catch (error) {
    console.log("view specific review m h error", error);
    next(error);
  }
};

//! my reviews

export const myReviews = async (req, res, next) => {
  try {
    const myReviews = await Review.find({ userId: req.user._id }).populate(
      "productId"
    );
    const reviewProductId = myReviews.map(review => review.productId._id)

    const orderData = await Order.aggregate([
      {
        $match : {userId : req.user._id}
      },
      {
        $unwind : "$orders"
      },
      {
        $unwind : "$orders.products"
      },
      {
        $match : {"orders.products.productId" : { $in : reviewProductId.map(id => new mongoose.Types.ObjectId(id))}}
      },  
      {
        $project : {
          _id : 0,
          productId : "$orders.products.productId",
          orderTime : "$orders.products.orderTime"
        }
      }
    ])

    const orderTime = orderData.reduce((map ,{productId, orderTime})=>{
      const pid = productId.toString()
      if(!map[pid]){
        map[pid] = orderTime
      }
      return map
    },{})

    const ReviewsWithOrderTime = myReviews.map((review) => {
      const obj = review.toObject();
      const pid = obj.productId?._id?.toString();
      obj.productId.orderTime = pid ? orderTime[pid] || null : null;
      return obj;
    });

    if (!myReviews) return next(errorHandler(400, "no reviews found!!"));

    // res.status(200).json(myReviews);
    res.status(200).json(ReviewsWithOrderTime)
  } catch (error) {
    console.log("my reviews m h error", error);
    next(error);
  }
};

//! delete specific/seperate review

export const deleteSeperateReview = async (req, res, next) => {
  try {
    await Review.findOneAndDelete({
      userId: req.user._id,
      productId: req.params.productId,
    });

    res.status(200).json("review deleted successfully!!");
  } catch (error) {
    console.log("delete seperate review m h error", error);
    next(error);
  }
};
