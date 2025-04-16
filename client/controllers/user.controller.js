import User from "../models/user.model.js"
import { errorHandler } from "../utils/errorHandler.js"


//! register
export const userRegister = async (req, res, next)=>{
    
    try {
        const {name, email, phone, password} = req.body
        if(!email && !phone) return next(errorHandler(400, "email or phone number is required"))

            const existingUser = await User.findOne({$or :[{email, phone}]})
    
            if(existingUser) return next(errorHandler(400, "already a user"))
    
        const newUser = new User({
            name,
            email,
            phone,
            password
        })

        await newUser.save()
        res.status(200).json(newUser)
    } catch (error) {
        console.log("create m h error", error)
        next(error)
    }
   
}