import CategoryImage from "../models/categoryImage.model.js"
import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import Sale from "../models/sale.model.js"
import User from "../models/user.model.js"
import Variant from "../models/variant.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import uploadToClodinary from "./clodinary.controller.js"

const currencyToLocaleMap = {
      USD: 'en-US',
        INR: 'en-IN',
  }

//! switch to user

export const switchToUser = async (req, res, next)=>{
    try {
        if(!req.user.isSeller) return next(errorHandler(401, "you are already a user!!!"))
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
    const {productName, productPrice,currency, discountPercentage, productDescription, productColor, productSize, category, subCategory} = req.body
    try {

    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!!"))

    // let imageUrl = ""
       let imageUrl = []

    if(req.files){
        // const result = await uploadToClodinary(req.file.path, "Product_Image")
        // const result = await uploadToClodinary(req, "Product_Image",next)
        // imageUrl = result.secure_url

        for( const file of req.files){
            const result = await uploadToClodinary(file.path, "Product_Images",next)
            imageUrl.push(result.secure_url)
        }
    }
   
    if(imageUrl.length == 0){
        imageUrl.push("https://odoo-community.org/web/image/product.template/1844/image_1024?unique=1e911c3")
    }
    const currencyStyle = currencyToLocaleMap[currency] || "en-US"

    const newProduct = new Product({
        productName,
        productImage : imageUrl, 
        productPrice, 
        currency,
        currencyStyle,
        discountPercentage,
        productDescription,
        productSize,
        productColor,
        category,
        subCategory,
        seller : req.user._id
    })

        await newProduct.save()

           if(productColor && productSize){
            const variant = new Variant({
                productId : newProduct._id,
                color : productColor,
                size : productSize,
                price : productPrice,
                title : productName,
                description : productDescription,
                image : imageUrl,
                currency : newProduct.currency,
                currencyStyle : newProduct.currencyStyle
            })
            await variant.save()
        }    

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

export const updateProduct = async (req, res, next) => {
  const {productName, productPrice, currency, discountPercentage, productDescription, productColor, productSize, category, subCategory} = req.body;

  try {
    if (!req.user.isSeller)
      return next(errorHandler(401, "you are not a seller"));

    // let imageUrl = ""

    let updatedFields = {
      productName,
      productPrice,
      discountPercentage,
      productColor,
      productDescription,
      productSize,
      category,
      subCategory,
    };

    if (currency) {
      updatedFields.currency = currency;
      updatedFields.currencyStyle = currencyToLocaleMap[currency] || "en-US";
    }

    if (req.files && req.files.length > 0) {
      let imageUrl = [];
      // const result = await uploadToClodinary(req, "Product_Image", next)
      // imageUrl = result.secure_url
      for (const file of req.files) {
        const result = await uploadToClodinary(file.path, "Product_Images", next);
        if (!result) return next(errorHandler(500, "image upload failed"));
        imageUrl.push(result.secure_url);
      }

      updatedFields.productImage = imageUrl;

      await Product.findByIdAndUpdate(req.params.productId, updatedFields, {
        new: true,
      });
    } else {
      await Product.findByIdAndUpdate(req.params.productId, updatedFields, {
        new: true,
      });
    }

    return res.status(200).json("product updated successfully!!!");
  } catch (error) {
    console.log("update product m h error", error);
    next(error);
  }
};

//! delete Product

export const deleteProduct = async (req, res, next)=>{
    try {
        if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller"))
            await Product.findByIdAndDelete(req.params.productId)

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

//! add category image

export const addCategoryImage = async (req, res, next)=>{
    const {category} = req.body

    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!"))

        let imageUrl = ""

        if(req.file){
            const result = await uploadToClodinary(req, "Category_Image", next)
            imageUrl = result.secure_url
        }

        const image = new CategoryImage({
            category,
            image : imageUrl
        })
        try {
            await image.save()
            res.status(200).json("category image added successfully!!")
        } catch (error) {
            console.log("category image m h error", error)
            next(error)
        }
}


//! get category image

export const getCategoryImage = async (req, res, next)=>{
    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!"))
    try {
        const images = await CategoryImage.find()
        res.status(200).json(images)
    } catch (error) {
        console.log("get category image m h error", error)
        next(error)
    }
}

//! update Category Image

export const updateCategoryImage = async (req, res, next)=>{
    if(!req.user.isSeller)  return next(errorHandler(401, "you are not a seller!!"))

        let imageUrl = ""
        if(req.file){
            const result = await uploadToClodinary(req, "Category_Image", next )
            imageUrl = result.secure_url
        }

    try {
        await CategoryImage.findByIdAndUpdate(req.params.id,{
            image : imageUrl
        },{new : true})

        res.status(200).json("category images changed successfully!!!")

    } catch (error) {
        console.log("update category image m h error", error)
        next(error)
    }
}

//! add variant

export const addVariant = async (req, res, next)=>{
    const {color, size, price, title, description} = req.body

    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!"))

        let imageUrl = []
        
        try {
            const product = await Product.findById({_id : req.params.productId})

            const existing = await Variant.findOne({productId : req.params.productId, size, color})

            if(existing){
                existing.price = price
                await existing.save()
                return res.status(200).json("variant updated successfully")
            }

            const sameColorVariant = await Variant.findOne({productId : req.params.productId, color})
            if(sameColorVariant){
                imageUrl = sameColorVariant.image
            }
            else if(req.files){
            for(const file of req.files){
            const result = await uploadToClodinary(file.path, "Variant_Images", next) 
            imageUrl.push(result.secure_url)
            }
        }
            
        const variant = new Variant({
            productId : req.params.productId,
            color,
            size,
            price,
            image : imageUrl,
            title,
            description,
            currency : product.currency,
            currencyStyle : product.currencyStyle
        })
            await variant.save()
            res.status(200).json("variant added successfully!!!")
    
        } catch (error) {
            console.log("add variant m h error", error)
            next(error)
        }
}

//! get all Variants

export const getAllVariants = async (req, res, next)=>{

    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!"))
    try {
        const variants = await Variant.find({productId : req.params.productId})
        res.status(200).json(variants)
    } catch (error) {
        console.log("get variants seller m h error", error)
        next(error)
    }
}

//! delete variant

export const deleteVariant = async(req, res, next)=>{
    if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!"))
    try {
        await Variant.findByIdAndDelete({_id : req.params.variantId})
        res.status(200).json("particular variant deleted successfully!!")
    } catch (error) {
        console.log("delete variant m h error", error)
        next(error)
    }
}

//! update delivery status

export const updateDeliveryStatus = async (req, res, next)=>{
    const {id, orderId} = req.params

    try {
        if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller"))

            const order = await Order.findOne({"orders._id" : orderId})
            const subOrder = order.orders.find(order=> order._id == orderId)
            const singleOrder = subOrder.products.find(a => a._id == id)

            if(singleOrder.isCancel || singleOrder.isReturn){
                return next(errorHandler(401, "this order was either cancelled or returned!!"))
            }

            if(singleOrder.isDelivered){
                return next(errorHandler(401, "already delivered!"))
            }
            
            singleOrder.isDelivered = true
            singleOrder.deliveredAt = Date.now()

            await order.save()

            res.status(200).json("delivery status updated successfully")         

        } catch (error) {
        console.log("update delivery status m h error", error)
        next(error)
    }
}

//! active for sale

export const addForSale = async (req, res, next) =>{

    const {discountPercentage} = req.body
    try {
        if(!req.user.isSeller) return next(errorHandler(401, "you are not a seller!!!"))

            const activeSale = await Sale.findOne({endTime : {$lt : Date.now()}})

             if(activeSale) return next(errorHandler(404, "sale is no longer exist!!!"))

            await Product.findByIdAndUpdate(req.params.productId,{
                discountPercentage,
                sale : true
            },{new : true})

            res.status(200).json("product added for sale")

            
    } catch (error) {
        console.log("active for sale", error)
        next(error)
    }
}