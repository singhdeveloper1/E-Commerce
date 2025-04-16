import express from "express"

const app = express()


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