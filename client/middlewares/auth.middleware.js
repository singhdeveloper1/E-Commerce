import jwt from "jsonwebtoken"
import Token from "../models/token.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import User from "../models/user.model.js"

export const authentication = async(req, res, next)=>{
    const token = req.cookies.token
    
    if(!token) return next(errorHandler(401, "invalid request"))
        
        const checkToken = await Token.findOne({token})
        
        if(!checkToken) return next(errorHandler(401, "invalid request"))
    
    try {

        const verify = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(verify.id)

        req.user = user
        return next()

    } catch (error) {
        console.log("auth middleware m h error", error)
        next(error)
    }
}