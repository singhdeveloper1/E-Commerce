import mongoose from "mongoose";
import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import { errorHandler } from "../utils/errorHandler.js"


//! place order
export const placeOrder = async (req, res, next) => {
  const {
    razorpay_order_id = 0,
    razorpay_payment_id = 0,
    razorpay_signature,
  } = req.body;
  try {
    // const cartItems = req.body.products;
    let cartItems = req.body.products

    if(!Array.isArray(cartItems)){
        cartItems = [cartItems]
    }

    const products = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) return next(errorHandler(404, "product not found"));

        return {
          productId: product._id,
          title: product.productName,
          image: product.productImage[0],
          price: item.price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        };
      })
    );

    //! if payment method is Bank

    let paymentStatus = "Pending";

    if (req.body.payment == "Bank") {
      const body = razorpay_order_id + "|" + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac("sha256", "razorpay_key_secret")
        .update(body.toString())
        .digest("hex");

      if (expectedSignature != razorpay_signature)
        return next(errorHandler(400, "payment verification failed"));

      paymentStatus = "Paid";
    }

    //! prepare order Object

    const newOrder = {
      products,
      payment: {
        method: req.body.payment,
        status: paymentStatus,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      },
      address: req.body.address,
    };

    //! check if the order already exist or not

    let order = await Order.findOne({ userId: req.user._id });

    if (order) {
      order.orders.push(newOrder);
      await order.save();
      return res.status(200).json("order placed successfully!!!");
    } else {
      order = new Order({
        userId: req.user._id,
        orders: [newOrder],
      });
      await order.save();
      res.status(201).json("order placed successfully");
    }
  } catch (error) {
    console.log("place order m h error", error);
    next(error);
  }
};


//! my order
export const myOrder = async (req, res, next)=>{
    try {
        // const orders = await Order.find({userId : req.user._id})
        // if(!orders) return next(errorHandler(404, "nothing in cart"))

        //     res.status(200).json(orders)

        const orders  = await Order.aggregate([
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
                $project : {
                    _id : 0,
                    orderId : "$orders._id",
                    product : "$orders.products",
                    payment : "$orders.payment",
                    address : "$orders.address"
                }
            }
        ])

        if(orders.length == 0) return next(errorHandler(400, "no product is ordered yet!!"))
          
        res.status(200).json(orders)

    } catch (error) {
        console.log("my order m h error", error)
        next(error)
    }
}

//! cancel Order

export const cancelOrder = async (req, res, next)=>{
  try {
    const orders = await Order.find({userId : req.user._id});
    for (const order of orders) {
      for (const subOrder of order.orders) {
        if (subOrder._id.toString() == req.params.orderId) {
          const product = subOrder.products.find(
            (p) => p.productId.toString() == req.params.productId
          );
          if(product && product.isCancel == true){
            return next(errorHandler(400, "this product was already cancelled"))
          }
          if (product) {
            product.isCancel = true;
            await order.save();
            return res.status(200).json("product cancelled successfully!!!!");
          }
        }
      }
    }
    res.status(404).json("no such product found for cancelletion!!")
  } catch (error) {
    console.log("cancel order m h error", error)
    next(error)
  }  
} 

//! view cancel order

export const viewCancelOrder = async (req, res, next)=>{
    try {
        const cancelledOrder = await Order.aggregate([
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
                $match : {
                    "orders.products.isCancel" : true
                }
            },
            {
                $project : {
                    _id : 0,
                    orderId : "$orders._id",
                    product : "$orders.products",
                    payment : "$orders.payment",
                    address : "$orders.address"
                }
            }
        ])
        if(cancelledOrder.length == 0) return next(errorHandler(400, "no product was cancelled yet!!"))
        res.status(200).json(cancelledOrder)
    } catch (error) {
        console.log("view cancel order", error)
        next(error)
    }
}

//! return order

export const returnOrder = async (req, res, next)=>{
  try {
    const orders = await Order.find({userId : req.user._id})

    for(const order of orders){
      for(const subOrder of order.orders){
        if(subOrder._id.toString() == req.params.orderId){
          const product = subOrder.products.find(p => p.productId.toString() == req.params.productId)
          if(product && product.isReturn == true){
            return next(errorHandler(400, "this product was already marked as return"))
          }
          if(product){
            product.isReturn = true
            await order.save()
            return res.status(200).json("product marked as return and will collect soon!")
          }
        }
      }
    }
    
    res.status(404).json("no such products found for return")
  } catch (error) {
    console.log("return order m h error", error)
    next(error)
  }
}


//! view return order

export const viewReturnOrder = async (req, res, next)=>{
  try {
    const returnedOrder = await Order.aggregate([
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
        $match : {
          "orders.products.isReturn" : true
        }
      },
        {
          $project : {
            _id : 0,
            orderId : "$orders._id",
            product : "$orders.products",
            payment : "$orders.payment",
            address : "$orders.address"
          }
      }
    ])

    if(returnedOrder.length == 0 ) return next(errorHandler(400, "no product was returned!!"))
      res.status(200).json(returnedOrder)
  } catch (error) {
    console.log("view return order m h error", error)
    next(error)
  }
}
