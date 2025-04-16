import express from "express"
import router from "./routes/user.route.js"

const app = express()

app.use(express.json())

app.use("/api", router)

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