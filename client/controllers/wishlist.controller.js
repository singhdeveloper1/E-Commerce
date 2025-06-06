import AddToWishlist from "../models/addToWishlist.model.js"
import { errorHandler } from "../utils/errorHandler.js"

//! ad to wishlist

export const addToWishlist = async (req, res, next) => {
  try {
    const wishlist = await AddToWishlist.findOne({ userId: req.user._id });

    if (!wishlist) {
      const newWishlist = new AddToWishlist({
        userId: req.user._id,
        products: [
          {
            productId: req.params.productId,
          },
        ],
      });
      await newWishlist.save();
      res.status(201).json("successfully added in wishlist!!!");
    } else {
      wishlist.products.map((product) => {
        if (product.productId == req.params.productId)
          return next(errorHandler(400, "already added in wishlist"));
      });

      wishlist.products.push({
        productId: req.params.productId,
      });
      await wishlist.save();
      res.status(201).json("successfully added in wishlist!!!");
    }
  } catch (error) {
    console.log("add to wishlist m h error", error);
    next(error);
  }
};

//! get wishlist

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await AddToWishlist.findOne({
      userId: req.user._id,
    }).populate("products.productId");

    // if(!wishlist || wishlist.length == 0) return next(errorHandler(404, "no product added in the wishlist"))
    if (!wishlist || wishlist.length == 0) return res.status(200).json([]);
    const product = wishlist.products.map((item) => {
      const product = item.productId;
      return {
        productId: product._id,
        title: product.productName,
        image: product.productImage,
        price: product.productPrice,
        size: product.productSize,
        color: product.productColor,
        category: product.category,
        subCategory: product.subCategory,
        discountPercentage: product.discountPercentage,
      };
    });

    // res.status(200).json(wishlist)
    res.status(200).json(product);
  } catch (error) {
    console.log("get wishlist m h error", error);
    next(error);
  }
};

//! delete one wishlist

export const deleteOneWishlist = async (req, res, next) => {
  try {
    const wishlist = await AddToWishlist.findOneAndUpdate(
      { userId: req.user._id },
      {
        $pull: {
          products: {
            productId: req.params.productId,
          },
        },
      },
      { new: true }
    );

    if (wishlist.products.length == 0) {
      await AddToWishlist.findOneAndDelete({ userId: req.user._id });
    }

    res.status(200).json("product is removed from the wishlist");
  } catch (error) {
    console.log("delete one wishlist m h error", error);
    next(error);
  }
};

//! delete full wishlist

export const deleteFullWishlist = async (req, res, next) => {
  try {
    await AddToWishlist.findOneAndDelete({ userId: req.user._id });
    res.status(200).json("wishlist deleted successfully!!!");
  } catch (error) {
    console.log("delete full wishlist", error);
    next(error);
  }
};