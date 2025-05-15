import AddToCart from "../models/addToCart.model.js"
import Product from "../models/product.model.js"
import { errorHandler } from "../utils/errorHandler.js"

//! add to cart

// export const addToCart = async (req, res, next)=>{

//     let quantity = 1

//     const added = new AddToCart({
//         userId : req.user._id,
//         products : [
//             {
//                 productId : req.params.productId,
//                 quantity
//             }
//         ]
//     })
//     try {
//         await added.save()
//         res.status(201).json("added to cart!!!")
//     } catch (error) {
//         console.log("add to cart m h error", error)
//         next(error)
//     }
// }

export const addToCart = async (req, res, next)=>{

    let quantity = 1
    
   try {
    const cart = await AddToCart.findOne({userId : req.user?._id})
   

    if(!cart){
        const added = new AddToCart({
            userId : req.user?._id,
            products : [
                {
                    productId : req.params.productId,
                    quantity
                }
            ]
        })
        await added.save()
 
        res.status(201).json("added to cart")
    }

    else{
        cart.products.map(product => {
            if(product.productId == req.params.productId) return next(errorHandler(400, "already added in cart"))
        })
        cart.products.push({
            productId : req.params.productId,           
            quantity
        })
        await cart.save()

        res.status(201).json("added to cart")
    }
   } catch (error) {
    console.log("add to cart m h error", error)
    next(error)
   }
}

//! view cart

export const viewCart = async (req, res, next)=>{
    
   try {
    const view = await AddToCart.findOne({userId : req.user._id}).populate("products.productId")

    if(view.length == 0) return next(errorHandler(404, "No product added in the cart"))


        const cart = view.products.map(item=>{
            const product = item.productId
            return{
            productId : product._id,
            title : product.productName,
            image : product.productImage,
            price : product.productPrice,
            quantity : item.quantity,
            category : product.category
            // totalPrice : product.productPrice * item.quantity
   }})

//    console.log(cart)

           res.status(200).json(cart)
        // res.status(200).json(view) 

   } catch (error) {
    console.log("view Cart m h error", error)
    next(error)
   }
   
}

//! view guest Cart

export const viewGuestCart = async (req, res, next)=>{
    const {guestCart} = req.body

    try {
        const productId = guestCart.map(item => item.productId)

        const product = await Product.find({_id : {$in: productId}})

        if(product.length == 0) return next(errorHandler(404, "no product added in the cart!!"))

        const cart = product.map(product =>{
            return {
                productId : product._id,
                title : product.productName,
                image : product.productImage,
                price : product.productPrice,
                quantity : 1,
                category : product.category
            }
        })

        res.status(200).json(cart)

    } catch (error) {
        console.log("view guest cart m h error", error)
        next(error)
    }
}

//! update cart product Quantity

export const updateCartQuantity = async (req, res, next)=>{
    // const {quantity} = req.body

    const {products} = req.body

    try {
        //  await AddToCart.findOneAndUpdate({userId : req.user._id, "products.productId" : req.params.productId},{
        //   $set :{ "products.$.quantity" : quantity }
        // }, {new : true}).populate("products.productId")

        // res.status(200).json("Product qunatity updated successfullyy!!!")

        const cart = await AddToCart.findOne({userId : req.user._id})

        products.forEach(item =>{
            const update = cart.products.find(product => product.productId.toString() == item.productId)

            if(update){
                update.quantity = item.quantity
            }
        })

        await cart.save()

        res.status(200).json("product quantity updated successfully!!!")
    
    } catch (error) {
        console.log("update quantity m h error", error)
        next(error)
    }
}

//! delete one product from cart

export const deleteOneCart = async (req, res, next)=>{
    try {
        const user = await AddToCart.findOneAndUpdate({userId : req.user._id },{
            $pull : {products : { productId : req.params.productId}}
        }, {new : true})

        if(user.products.length == 0){
            await AddToCart.findOneAndDelete({userId : req.user._id})
        }

        res.status(200).json("product is removed from the cart")
               
    } catch (error) {
        console.log("delete one product m h error", error)
        next(error)
    }
}

//! delete full cart

export const deleteFullCart = async (req, res, next)=>{
    try {
        await AddToCart.findOneAndDelete({userId : req.user._id})
        res.status(200).json("Cart deleted succesfully!!!")
    } catch (error) {
        console.log("delete all cart m h error", error)
        next(error)
    }
}