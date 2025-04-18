import express from "express"
import userRouter from "./routes/user.route.js"
import cookieParser from "cookie-parser"
import otpRouter from "./routes/otp.routes.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/otp", otpRouter)

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