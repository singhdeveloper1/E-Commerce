import User from "../models/user.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import Token from "../models/token.model.js"
import Address from "../models/address.model.js"
import bcrypt from "bcryptjs"
import OTP from "../models/otp.model.js"
import sendMail from "../mailsender/mailsender.js"
import BlackListToken from "../models/blacklistToken.model.js"


//! register
export const userRegister = async (req, res, next)=>{
    
    try {
        const {name, email, phone, password} = req.body

        // const verification = await OTP.findOne({$or : [{email, phone}]})

        // if(!verification || !verification.verified) return next(errorHandler(401,"please verify your email or phone first"))

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
        res.status(201).json({message : "successfully registered!!"})
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

            // const existingToken = await Token.findOne({userId : existingUser._id})

            // if(existingToken) return next(errorHandler(403, "user already logged in..."))

            const checkPassword = await existingUser.isPasswordCorrect(password)

            if(!checkPassword) return next(errorHandler(401, "Not a existing user"))


                await Token.findOneAndDelete({userId : existingUser._id})



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

export const google = async (req, res,next)=>{
    const {name, email} = req.body

    try {
        const existingUser = await User.findOne({email})
        
        if(existingUser){
            const token = await existingUser.generateToken()

            await Token.findOneAndDelete({userId : existingUser._id})

            //! storing token in token model

            const newToken = new Token({
                userId : existingUser._id,
                token : token
            })
            await newToken.save()
            res.cookie("token", newToken)
            res.status(200).json({existingUser, newToken})

        }
            else{
                const generatePassword = Math.random().toString(36).slice(-8)
                const hashedPassword = await bcrypt.hash(generatePassword,10)                

                const newUser = new User({
                    name,
                    email,
                    password : hashedPassword
                })

                await newUser.save()

                const token = await newUser.generateToken()

            //! storing token in token model

            const newToken = new Token({
                userId : newUser._id,
                token : token
            })
            await newToken.save()
            res.cookie("token", newToken)
            res.status(200).json({newUser, newToken})

                // res.status(200).json(newUser)
            }


    } catch (error) {
        console.log("google sign-up , login m h error", error)
        next(error)
    }
    
}

//! forgot password 

export const forgotPassword = async (req, res, next)=>{

    try {
        const {email, phone} = req.body
        if(!email && !phone) return next(errorHandler(400, "please provide email or phone first"))

           const otp =  Math.floor(Math.random() * 1000000)

           sendMail(email, "Use this Password to login!!", `Use this password ${otp} to login your account.. it is recommended to change password once you logged in successfully!!!` )

           const string = otp.toString()

           const hashed = await bcrypt.hash(string, 10)

            await User.findOneAndUpdate({email},{
            password : hashed
           },{new : true})

           res.status(200).json("password sent successfull to you email address, use that password to login!!")
           
    } catch (error) {
        console.log("forgot password m h error", error)
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
        const { email, phone, firstName, lastName, address} =  req.body
        console.log(req.body)
            await User.findByIdAndUpdate(req.user._id,{
            email,
            phone,
            firstName,
            lastName,
            address
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
        const {currentPassword, newPassword} = req.body
        console.log(req.body)

        const user = await User.findById(req.user._id)

        const checkPassword = await user.isPasswordCorrect(currentPassword)

        if(!checkPassword) return next(errorHandler(401, " current password is incorrect"))

            const hashedPassword = await bcrypt.hash(newPassword, 10)


         await User.findByIdAndUpdate(req.user._id,{
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

//! delete user address

export const deleteUserAddress = async (req, res, next) =>{
    try {
        await Address.findByIdAndDelete(req.params.id)

        res.status(200).json("address is deleted!!!")
    } catch (error) {
        console.log("delete address m h error", error)
        next(error)
    }
}


//! logout

export const userLogout = async (req, res)=>{
    const token = req.cookies.token ||req.headers.authorization && req.headers.authorization.split(' ')[1]

    const blacklisted = new BlackListToken({
        token
    })

    try {
        await blacklisted.save()
        res.clearCookie("token")

        res.status(200).json("logged out successfully!!!")
    } catch (error) {
        console.log("logout m h error", error)
        next(error)
    }
}


//! switch to seller

export const switchToSeller = async (req, res, next)=>{
    try {

        await User.findByIdAndUpdate(req.user._id,{
            isSeller : true
        },{new : true})

        res.status(200).json("switched to seller successfully")
    } catch (error) {
        console.log("switch to seller m h error", error)
        next(error)
    }
}