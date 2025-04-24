import express from "express"
import userRouter from "./routes/user.route.js"
import cookieParser from "cookie-parser"
import otpRouter from "./routes/otp.routes.js"
import sellerRouter from "./routes/seller.route.js"
import cartRouter from "./routes/cart.route.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/otp", otpRouter)
app.use("/api/seller", sellerRouter)
app.use("/api/cart", cartRouter)

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