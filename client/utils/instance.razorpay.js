import Razorpay from  "razorpay"

const instance = new Razorpay({
    key_id : "razorpay_key_id",
    key_secret : "razorpay_key_secret"
})

export default instance