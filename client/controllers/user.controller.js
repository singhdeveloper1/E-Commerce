import User from "../models/user.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import Token from "../models/token.model.js"
import Address from "../models/address.model.js"
import bcrypt from "bcryptjs"
import OTP from "../models/otp.model.js"


//! register
export const userRegister = async (req, res, next)=>{
    
    try {
        const {name, email, phone, password} = req.body

        const verification = await OTP.findOne({$or : [{email, phone}]})

        if(!verification || !verification.verified) return next(errorHandler(401,"please verify your email or phone first"))

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
        const { phone, email, password} = req.body

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

//! google Login

export const google = async (req, res)=>{
    const {name, email} = req.body

    try {
        const existingUser = await User.findOne({email})
        
        if(existingUser){
            const token = await existingUser.generateToken()

            //! storing token in token model

            const newToken = new Token({
                userId : existingUser._id,
                token : token
            })
            await newToken.save()

        }
            else{
                const generatePassword = Math.Random().toString(36).slice(-8)
                const hashedPassword = await bcrypt.hash(generatePassword,10)                

                const newUser = new User({
                    name,
                    email,
                    password : hashedPassword
                })

                await newUser.save()

                res.status(200).json(newUser)
            }


    } catch (error) {
        console.log("google sign-up , login m h error", error)
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

//! update userData

export const updateUserData = async (req, res, next)=>{
    try {
        const {name, email, phone} =  req.body
        const newUserData = await User.findByIdAndUpdate(req.user._id,{
            name,
            email,
            phone
        },{new : true})

        res.status(200).json({msg : "update successfullyy"})

    } catch (error) {
        console.log("update user m h error", error)
        next(error)
    }
}

//! update user Password

export const updateUserPassword = async (req, res, next) =>{
    try {
        const {oldPassword, newPassword} = req.body

        const user = await User.findById(req.user._id)

        const checkPassword = await user.isPasswordCorrect(oldPassword)

        if(!checkPassword) return next(errorHandler(401, "password is incorrect"))

            const hashedPassword = await bcrypt.hash(newPassword, 10)


         const updatedPassword = await User.findByIdAndUpdate(req.user._id,{
            password : hashedPassword
         },{new : true})   

         res.status(200).json({msg : "password updated successfully!!!"})


    } catch (error) {
        console.log("update user password m h error" , error)
        next(error)
    }
}

//! user address

export const userAddress = async (req, res, next)=>{
    
    const {address, state, city, pincode, phone} = req.body
    const id = req.user._id

    if(phone.toString().length > 10) return next(errorHandler(400, "phone no. length must me less than 11 values"))

    const newAddress = new Address({
        userId : id,
        address,
        state,
        city,
        pincode,
        phone
    })
    try {
        await newAddress.save()        
        res.status(200).json(newAddress)
    } catch (error) {
        console.log("user address m h error", error)
    }
}

//! get user address

export const getUserAddress = async (req, res, next)=>{
    try {
        const address = await Address.find({userId : {$in : req.user._id}})
        res.status(200).json(address)
    } catch (error) {
        console.log("get user data m h error", error)
        next(error)
    }
}

//! update user Address

export const updateUserAddress = async (req, res, next)=>{

    try {
        const {address, state, city, pincode, phone} = req.body
        const updatedAddress = await Address.findByIdAndUpdate(req.params.id,{
            address,
            state,
            city,
            pincode,
            phone
        },{new : true})

        res.status(200).json({msg : "address updated Successfully!!!!"})

    } catch (error) {
        console.log("update user address m h error", error)
        next(error)
    }
}