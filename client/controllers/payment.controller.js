import instance from "../utils/instance.razorpay.js"
import crypto from "crypto"

export const order = async (req, res, next) => {
  const { amount, currency, receipt } = req.body;

  try {
    const order = await instance.orders.create({
      amount: amount * 100,
      currency,
      receipt,
    });

    res.status(200).json(order);
  } catch (error) {
    console.log("checkout m h error", error);
    next(error);
  }
};

//! payment verification

// export const paymentVerification = async (req, res , next)=>{
//     const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

//     const body = razorpay_order_id + "|" + razorpay_payment_id

//     const expectedSignature =  crypto.createHmac("sha256", "razorpay_key_secret")
//                                      .update(body.toString())                           
//                                      .digest("hex")

//         if(expectedSignature === razorpay_signature){

//             //! store in db

//             res.json("payment verified successfull")
//         }
//         else{
//             res.json("invalid signature")
//         }
// }