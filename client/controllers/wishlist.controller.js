import AddToWishlist from "../models/addToWishlist.model.js"

//! ad to wishlist

export const addToWishlist = async (req, res, next)=>{

    try {
        const wishlist = await AddToWishlist.findOne({userId : req.user._id})

        if(!wishlist){
            const newWishlist = new AddToWishlist({
                userId : req.user._id,
                products : [
                    {
                        productId : req.params.productId
                    }
                ]
            })
            await newWishlist.save()
            res.status(201).json("successfully added in wishlist!!!")
        }

        else{
            wishlist.products.push({
                productId : req.params.productId
            })
            await wishlist.save()
            res.status(201).json("successfully added in wishlist!!!")
        }
    } catch (error) {
        console.log("add to wishlist m h error", error)
        next(error)
    }
}

//! get wishlist

export const getWishlist = async (req, res, next)=>{
    try {
        const wishlist = await AddToWishlist.find({userId : req.user._id}).populate("products.productId")
        res.status(200).json(wishlist)
    } catch (error) {
        console.log("get wishlist m h error", error)
        next(error)
    }
}