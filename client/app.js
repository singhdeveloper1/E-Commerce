import express from "express"
import userRouter from "./routes/user.route.js"
import cookieParser from "cookie-parser"
import otpRouter from "./routes/otp.routes.js"
import sellerRouter from "./routes/seller.route.js"
import cartRouter from "./routes/cart.route.js"
import wishlistRouter from "./routes/wishlist.route.js"
import reviewRouter from "./routes/review.route.js"
import {swaggerUi, swaggerDocument} from "./swagger/swagger.js"
import cors from "cors"
import commonRouter from "./routes/common.route.js"
import orderRoute from "./routes/order.route.js"
import couponRoute from "./routes/coupon.route.js"
import paymentRoute from "./routes/payment.route.js"
import carouselRoute from "./routes/carousel.route.js"
import memberRoute from "./routes/member.route.js"
import dashboardRoute from "./routes/dashboard.route.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.get("/",(req, res)=>{
    res.send("hello")
})


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/api/user", userRouter)
app.use("/api/otp", otpRouter)
app.use("/api/seller", sellerRouter)
app.use("/api/cart", cartRouter)
app.use("/api/wishlist", wishlistRouter)
app.use("/api/review", reviewRouter)
app.use("/api/common", commonRouter)
app.use("/api/order", orderRoute)
app.use("/api/coupon", couponRoute)
app.use("/api/payment", paymentRoute)
app.use("/api/carousel", carouselRoute)
app.use("/api/member", memberRoute)
app.use("/api/dashboard", dashboardRoute)

//! for error
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(statusCode).json({
        success : false,
        message,
        statusCode
    })
})

export default app