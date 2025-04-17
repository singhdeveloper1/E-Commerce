import { now } from "mongoose"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import Token from "../models/token.model.js"


//! register
export const userRegister = async (req, res, next)=>{
    
    try {
        const {name, email, phone, password} = req.body
        // console.log(phone.toString().length)
        // console.log(typeof phone)
        if(!email && !phone) return next(errorHandler(400, "email or phone number is required"))
            if(phone && phone.toString().length > 10) return next(errorHandler(400, "phone no. length must be less than 11 numbers"))

            const existingUser = await User.findOne({$or :[{email, phone}]})
    
            if(existingUser) return next(errorHandler(400, "already a user"))
    
        const newUser = new User({
            name,
            email,
            phone,
            password
        })

        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        console.log("create m h error", error)
        next(error)
    }
   
}

//! login 

export const userLogin = async (req, res, next)=>{

    try {
        const {name, phone, email, password} = req.body

        const existingUser = await User.findOne({$or : [{email, phone}]})

        if(!existingUser) return next(errorHandler(401, "Not a existing user"))

            const checkPassword = await existingUser.isPasswordCorrect(password)

            if(!checkPassword) return next(errorHandler(401, "Not a existing user"))

                const token = await existingUser.generateToken()

                //! storing token in token.model

                const newToken = new Token({
                    userId : existingUser._id,
                    token : token
                })

                await newToken.save()

                res.cookie("token", token)

                res.status(200).json({existingUser, token})


    } catch (error) {
        console.log("login m h error", error)
        next(error)
    }
}

//! get user data

export const userData = async (req, res, next)=>{
    
    try {
        const user = await User.find(req.user._id)
        res.status(200).json(user)
    } catch (error) {
        console.log("get user m h error", error)
        next(error)
    }
}