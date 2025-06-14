import Carousel from "../models/carousel.model.js"
import Member from "../models/member.model.js"
import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import Review from "../models/review.model.js"
import Sale from "../models/sale.model.js"
import Variant from "../models/variant.model.js"
import { convertCurrency } from "../utils/currencyConverter.js"
import { errorHandler } from "../utils/errorHandler.js"

const currencyToLocaleMap = {
      USD: 'en-US',
        INR: 'en-IN',
  }


//! sale

export const sale = async (req, res, next) => {
  // const {startTime, endTime, discount} = req.body
  const { startTime, endTime } = req.body;

  const activeSale = await Sale.findOne();

  try {
    if (!activeSale) {
      const newSale = new Sale({
        startTime,
        endTime,
        // discount
      });

      await newSale.save();
      res.status(200).json(newSale);
    } else {
      (activeSale.startTime = startTime), (activeSale.endTime = endTime);
      // activeSale.discount = discount

      await activeSale.save();
      res.status(200).json(activeSale);
    }
  } catch (error) {
    console.log("sale m h error", error);
    next(error);
  }
};

//! get All Product
export const getAllProduct = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages && totalPages !== 0) {
      return next(
        errorHandler(400, `page ${page} exceed totalPages (${totalPages})`)
      );
    }

    const products = await Product.find().skip(skip).limit(limit);

    const ProductsWithRating = await Promise.all(
      products.map(async (item) => {
        const reviews = await Review.find({ productId: item._id });
        let ratedPerson = 0;
        let averageRating = 0;
        if (reviews.length && reviews.length > 0) {
          const total = reviews.reduce((sum, item) => {
            return sum + item.rating;
          }, 0);
          averageRating = total / reviews.length;

          ratedPerson = reviews.length;
        }

        return {
          ...item.toObject(),
          averageRating,
          ratedPerson,
        };
      })
    );

    // res.status(200).json(products)
    // res.status(200).json( ProductsWithRating )
    res.status(200).json({
      currentPage: page,
      totalPages,
      totalProducts,
      products: ProductsWithRating,
    });
  } catch (error) {
    console.log("get all product common m h error", error);
    next(error);
  }
};

//! get Specific Product

export const getSpecificProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    const variant = await Variant.find({ productId: req.params.productId });
    const colors = [...new Set(variant.map((v) => v.color))];

    let sizes = [];
    if (colors.length > 0) {
      const color = variant.filter((v) => v.color === product.productColor);
      sizes = [...new Set(color.map((v) => v.size))];
    } else {
      sizes = [product.productSize];
    }

    //! currecncy converter
    if (req.query.currency) {
      if (product.currency !== req.query.currency) {
        const result = await convertCurrency(
          product.productPrice,
          product.currency,
          req.query.currency
        );
        product.productPrice = Math.floor(result.convertedAmount);
        product.currency = req.query.currency;
        product.currencyStyle =
          currencyToLocaleMap[req.query.currency] || "en-US";
      }
    }

    //! for rating
    const reviews = await Review.find({ productId: product._id });
    let ratedPerson = 0;
    let averageRating = 0;
    if (reviews.length && reviews.length > 0) {
      const total = reviews.reduce((sum, item) => {
        return sum + item.rating;
      }, 0);
      averageRating = total / reviews.length;

      ratedPerson = reviews.length;
    }
    //    if(!product.productSize){
    //     sizes = []
    //    }
    //    else{
    //     sizes = [product.productSize]
    //    }

    const products = {
      productId: product._id,
      title: product.productName,
      image: product.productImage,
      price: product.productPrice,
      currency: product.currency,
      currencyStyle: product.currencyStyle,
      description: product.productDescription,
      sizes,
      color: product.productColor,
      category: product.category,
      subCategory: product.subCategory,
      averageRating,
      ratedPerson,
      colors,
      // sizes
      // totalPrice : product.productPrice * item.quantity
    };
    res.status(200).json(products);
  } catch (error) {
    console.log("get specific product common m h error", error);
    next(error);
  }
};

//! get product by category

export const getProductByCategory = async (req, res, next) => {
  try {
    const decodedCategory = decodeURIComponent(req.params.category).replace(
      / /g,
      "_"
    );

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments({
      category: decodedCategory,
    });
    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages && totalPages !== 0) {
      return next(
        errorHandler(400, `page ${page} exceeds totalPages (${totalPages})`)
      );
    }

    // const product = await Product.find({category : req.params.category})
    const product = await Product.find({ category: decodedCategory })
      .skip(skip)
      .limit(limit);

    if (!product)
      return next(errorHandler(404, "no product found for this sub category"));

    const ProductsWithRating = await Promise.all(
      product.map(async (item) => {
        const reviews = await Review.find({ productId: item._id });
        let ratedPerson = 0;
        let averageRating = 0;
        if (reviews.length && reviews.length > 0) {
          const total = reviews.reduce((sum, item) => {
            return sum + item.rating;
          }, 0);
          averageRating = total / reviews.length;

          ratedPerson = reviews.length;
        }

        return {
          ...item.toObject(),
          averageRating,
          ratedPerson,
        };
      })
    );

    // res.status(200).json(product)
    // res.status(200).json(ProductsWithRating)
    res.status(200).json({
      currentPage: page,
      totalPages,
      totalProducts,
      products: ProductsWithRating,
    });
  } catch (error) {
    console.log("get product by category m h error", error);
    next(error);
  }
};

//! get product by sub Category

export const getProductBySubCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments({
      subCategory: req.params.subCategory,
    });
    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages && totalPages !== 0) {
      return next(
        errorHandler(400, `pages ${page} exceed totalPages (${totalPages})`)
      );
    }

    const product = await Product.find({ subCategory: req.params.subCategory })
      .skip(skip)
      .limit(limit);
    if (!product)
      return next(errorHandler(404, "no product found for this subCategory"));

    const ProductsWithRating = await Promise.all(
      product.map(async (item) => {
        const reviews = await Review.find({ productId: item._id });
        let ratedPerson = 0;
        let averageRating = 0;
        if (reviews.length && reviews.length > 0) {
          const total = reviews.reduce((sum, item) => {
            return sum + item.rating;
          }, 0);
          averageRating = total / reviews.length;

          ratedPerson = reviews.length;
        }

        return {
          ...item.toObject(),
          averageRating,
          ratedPerson,
        };
      })
    );

    // res.status(200).json(product)
    // res.status(200).json(ProductsWithRating)
    res.status(200).json({
      currentPage: page,
      totalPages,
      totalProducts,
      products: ProductsWithRating,
    });
  } catch (error) {
    console.log("get product by subcategory m h error", error);
    next(error);
  }
};

//! get new Arrival

export const getNewArrival = async (req, res, next) => {
  try {
    const product = await Product.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$category",
          latestProducts: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "categoryimages",
          localField: "_id",
          foreignField: "category",
          as: "categoryImage",
        },
      },
      {
        $unwind: "$categoryImage",
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          image: "$categoryImage.image",
          products: { $slice: ["$latestProducts", 20] },
        },
      },
      {
        $limit: 5,
      },
    ]);

    const result = {};
    product.forEach((item) => {
      result[item.category] = {
        image: item.image,
        products: item.products,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.log("get new Arrival m h error", error);
    next(error);
  }
};

//! get sale product

export const getSaleProduct = async (req, res, next) => {
  try {
    const sale = await Sale.findOne();
    const endTime = sale.endTime;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments({ sale: true });
    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages && totalPages !== 0) {
      return next(
        errorHandler(400, `page ${page} exceed totalPages (${totalPages})`)
      );
    }

    const activeForSale = await Product.find({ sale: true })
      .skip(skip)
      .limit(limit);
    if (activeForSale.length == 0)
      return next(errorHandler(404, "no products are there in sale"));

    // const discount = await Sale.findOne()
    // const saleDiscount = discount.discount

    const activeSale = await Sale.findOne({ endTime: { $lt: Date.now() } });
    if (activeSale) {
      activeForSale.forEach(async (product) => {
        (product.sale = false), (product.discountPercentage = 0);

        await product.save();
      });
      return next(errorHandler(404, "sale is no longer exist!!!"));
    }

    const ProductsWithRating = await Promise.all(
      activeForSale.map(async (item) => {
        const reviews = await Review.find({ productId: item._id });
        let ratedPerson = 0;
        let averageRating = 0;
        if (reviews.length && reviews.length > 0) {
          const total = reviews.reduce((sum, item) => {
            return sum + item.rating;
          }, 0);
          averageRating = total / reviews.length;

          ratedPerson = reviews.length;
        }

        return {
          ...item.toObject(),
          averageRating,
          ratedPerson,
        };
      })
    );

    // res.status(200).json(activeForSale)
    // res.status(200).json(ProductsWithRating)
    // res.status(200).json({ProductsWithRating, endTime})
    res.status(200).json({
      currentPage: page,
      totalPages,
      totalProducts,
      endTime,
      products: ProductsWithRating,
    });
  } catch (error) {
    console.log("get sale product m h error", error);
    next(error);
  }
};

//! get limited sale product

export const getLimitedSaleProduct = async (req, res, next) => {
  try {
    const sale = await Sale.findOne();
    const endTime = sale.endTime;

    const activeForSale = await Product.find({ sale: true }).skip(0).limit(6);
    if (activeForSale.length == 0)
      return next(errorHandler(404, "no products are there in sale"));

    const ProductsWithRating = await Promise.all(
      activeForSale.map(async (item) => {
        const reviews = await Review.find({ productId: item._id });
        let ratedPerson = 0;
        let averageRating = 0;
        if (reviews.length && reviews.length > 0) {
          const total = reviews.reduce((sum, item) => {
            return sum + item.rating;
          }, 0);
          averageRating = total / reviews.length;

          ratedPerson = reviews.length;
        }

        return {
          ...item.toObject(),
          averageRating,
          ratedPerson,
          endTime,
        };
      })
    );

    const activeSale = await Sale.findOne({ endTime: { $lt: Date.now() } });

    if (activeSale) {
      activeForSale.forEach(async (product) => {
        (product.sale = false), (product.discountPercentage = 0);
        await product.save();
      });

      return next(errorHandler(404, "sale is no longer exist!!!"));
    }

    res.status(200).json(ProductsWithRating);
  } catch (error) {
    console.log("get limited sale product m h error", error);
    next(error);
  }
};

//! get best selling

export const getBestSelling = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //!get total count of unique best Selling products
    const totalCount = await Order.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $unwind: "$orders.products",
      },
      {
        $group: {
          _id: "$orders.products.productId",
          totalSold: { $sum: "$orders.products.quantity" },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const totalProducts = totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages && totalPages !== 0) {
      return next(
        errorHandler(400, `page ${page} exceed totalPages ${totalPages}`)
      );
    }

    //!get paginated best selling products
    const orders = await Order.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $unwind: "$orders.products",
      },
      {
        $group: {
          _id: "$orders.products.productId",
          totalSold: { $sum: "$orders.products.quantity" },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: "$product._id",
          productName: "$product.productName",
          productImage: "$product.productImage",
          productPrice: "$product.productPrice",
          discountPercentage: "$product.discountPercentage",
          productDescription: "$product.productDescription",
          category: "$product.category",
          subCategory: "$product.subCategory",
          seller: "$product.seller",
          createdAt: "$product.createdAt",
          updatedAt: "$product.updatedAt",
          sale: "$product.sale",
          currency: "$product.currency",
          currencyStyle: "$product.currencyStyle",
          averageRating: "$product.averageRating",
          ratedPerson: "$product.ratedPerson",
          totalSold: 1,
        },
      },
    ]);

    //! for rating
    const ProductsWithRating = await Promise.all(
      orders.map(async (item) => {
        const reviews = await Review.find({ productId: item._id });
        let ratedPerson = 0;
        let averageRating = 0;
        if (reviews.length && reviews.length > 0) {
          const total = reviews.reduce((sum, item) => {
            return sum + item.rating;
          }, 0);
          averageRating = total / reviews.length;

          ratedPerson = reviews.length;
        }

        return {
          // ...item.toObject(), averageRating, ratedPerson
          ...item,
          averageRating,
          ratedPerson,
        };
      })
    );
    // res.status(200).json(ProductsWithRating)
    res.status(200).json({
      currentPage: page,
      totalPages,
      totalProducts,
      products: ProductsWithRating,
    });
  } catch (error) {
    console.log("get best selling m h error", error);
    next(error);
  }
};

//! get carousel

export const getCarousel = async (req, res, next) => {
  try {
    const carousel = await Carousel.find();

    res.status(200).json(carousel);
  } catch (error) {
    console.log("get carousel m h error", error);
    next(error);
  }
};

//! get Member

export const getMember = async (req, res, next) => {
  try {
    const member = await Member.find();
    res.status(200).json(member);
  } catch (error) {
    console.log("get member m h error", error);
    next(error);
  }
};

//! get annual Report

export const getAnnualReport = async (req, res, next) => {
  try {
    const thirtyDayAgo = new Date();
    thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const activeUser = await Order.aggregate([
      {
        $match: { createdAt: { $gte: thirtyDayAgo } },
      },
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $count: "activeUser",
      },
    ]);

    const activeSeller = await Order.aggregate([
      {
        $match: { createdAt: { $gte: thirtyDayAgo } },
      },
      {
        $unwind: "$orders",
      },
      {
        $unwind: "$orders.products",
      },
      {
        $lookup: {
          from: "products",
          localField: "orders.products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: null,
          activeSellers: {
            $addToSet: "$productDetails.seller",
          },
          monthlyProductSale: {
            $sum: "$orders.products.quantity",
          },
        },
      },
      {
        $project: {
          _id: 0,
          activeSellers: { $size: "$activeSellers" },
          monthlyProductSale: 1,
        },
      },
    ]);

    const grossSale = await Order.aggregate([
      {
        $match: { createdAt: { $gte: oneYearAgo } },
      },
      {
        $unwind: "$orders",
      },
      {
        $unwind: "$orders.products",
      },
      {
        $project: {
          lineTotal: {
            $multiply: ["$orders.products.price", "$orders.products.quantity"],
          },
        },
      },
      {
        $group: {
          _id: null,
          annualGross: { $sum: "$lineTotal" },
        },
      },
      {
        $project: {
          _id: 0,
          annualGross: 1,
        },
      },
    ]);

    const activeUsers = activeUser[0]?.activeUser || 0;
    const { activeSellers = 0, monthlyProductSale = 0 } = activeSeller[0];
    const annualGrossSale = grossSale[0]?.annualGross || 0;

    res
      .status(200)
      .json({
        activeSellers,
        monthlyProductSale,
        activeUsers,
        annualGrossSale,
      });
  } catch (error) {
    console.log("get annual report m h error", error);
    next(error);
  }
};

//! get variant

export const getVariant = async (req, res, next) => {
  const { size, color } = req.query;
  const productId = req.params.productId;

  try {
    const product = await Product.findOne({ _id: productId });
    // return res.status(200).json(product)

    if (req.query.currency) {
      if (product.currency !== req.query.currency) {
        const result = await convertCurrency(
          product.productPrice,
          product.currency,
          req.query.currency
        );
        product.productPrice = result.convertedAmount;
        product.currency = req.query.currency;
      }
    }

    if (color && !size) {
      const variants = await Variant.find({ productId, color });
      const image = variants[0].image;
      const title = variants[0].title;
      const description = variants[0].description;
      const sizes = [...new Set(variants.map((v) => v.size))];
      const price = Math.floor(product.productPrice);
      const currency = product.currency;
      if (sizes.length === 0)
        return next(
          errorHandler(400, "no size found for the provided color..")
        );
      return res
        .status(200)
        .json({
          color,
          sizes,
          image,
          title,
          description,
          price,
          currency,
          productId,
        });
    }

    if ((color, size)) {
      const variant = await Variant.findOne({ productId, size, color });
      if (req.query.currency) {
        if (variant.currency !== req.query.currency) {
          const result = await convertCurrency(
            variant.price,
            variant.currency,
            req.query.currency
          );
          variant.price = Math.floor(result.convertedAmount);
          variant.currency = req.query.currency;
        }
      }
      const price = variant.price;
      const currency = variant.currency;
      const image = variant.image;
      const title = variant.title;
      const description = variant.description;
      if (!variant)
        return next(
          errorHandler(400, "no variant found for give size and color..")
        );
      //  return res.status(200).json(variant)
      return res
        .status(200)
        .json({
          productId,
          color,
          size,
          price,
          currency,
          image,
          title,
          description,
        });
    }

    if (!size && !color)
      return next(errorHandler(401, "no variant is selected.."));
  } catch (error) {
    console.log("get variant m h error", error);
    next(error);
  }
};

//! get filtered Products

export const getFilteredProducts = async (req, res, next) => {
  const {
    search,
    category,
    subCategory,
    size,
    color,
    minPrice,
    maxPrice,
    page = 1,
    limit = 3,
  } = req.query;

  if (!search && !category && !subCategory && !minPrice && !maxPrice) {
    return res.status(200).json("no filters were applied!!");
  }

  try {
    const query = {};

    // if (search) {
    //   query.$or = [
    //     { productName: { $regex: search, $options: "i" } },
    //     { category: { $regex: search, $options: "i" } },
    //     { subCategory: { $regex: search, $options: "i" } },
    //   ];
    // }

    if (search) {
      query.productName = { $regex: search, $options: "i" };
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

    if (product.length == 0) {
      return res
        .status(404)
        .json("no product is found for the selected page or filters!!");
    }

    const ProductsWithRating = await Promise.all(
      product.map(async (item) => {
        const reviews = await Review.find({ productId: item._id });
        let ratedPerson = 0;
        let averageRating = 0;
        if (reviews.length && reviews.length > 0) {
          const total = reviews.reduce((sum, item) => {
            return sum + item.rating;
          }, 0);
          averageRating = total / reviews.length;

          ratedPerson = reviews.length;
        }
        return {
          ...item.toObject(),
          averageRating,
          ratedPerson,
          // ...item, averageRating, ratedPerson
        };
      })
    );

    // const total = await Product.countDocuments(query)

    res.status(200).json(ProductsWithRating);
  } catch (error) {
    console.log("get filtered product m h error", error);
    next(error);
  }
};