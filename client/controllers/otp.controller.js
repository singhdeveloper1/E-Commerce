import sendMail from "../mailsender/mailsender.js"
import OTP from "../models/otp.model.js"
import { errorHandler } from "../utils/errorHandler.js"

//! get otp
export const getOTP = async (req, res, next) =>{

    const {email, phone} = req.body

    if(!phone && !email) return next(errorHandler(400,"email or phone is required to send otp"))

        await OTP.findOneAndDelete({$or : [{email, phone}]})
        

        // const otp =  Math.floor(Math.random() * 10000)
        const otp = Math.floor(100000 + Math.random() * 900000);

        sendMail(email, "One Time Password!!" , `this is the OTP <h2>${otp}</h2 for your email and its only valid for <h3>5 Min</h3>`)

        const newOTP = new OTP({
            email,
            phone,
            otp,
        })

        try {
            await newOTP.save()
            res.status(200).json("OTP send Successfullyy!!!")
        } catch (error) {
            console.log("get otp m h error", error)
        }
}

//! verify OTP

export const verifyOTP = async (req, res, next)=>{
    const {email, phone, otp} = req.body

    const existingOTP = await OTP.findOne({$or : [{email, phone}]})

    if(!existingOTP) return next(errorHandler(404,"otp is not present"))

        const DB_OTP = existingOTP.otp

        // console.log(existingOTP.otp)

        console.log(existingOTP.otp === otp)

      if(otp != DB_OTP) return next(errorHandler(401, "invalid otp"))

        // await OTP.findOneAndDelete({$or : [{email, phone}]})

        try {
            await OTP.findByIdAndUpdate(existingOTP._id,{
                verified : true,
                createdAt : new Date(Date.now() + 10 * 60 * 1000)
            },{new : true})
            res.status(200).json("verifieddd !!!")
        } catch (error) {
            console.log("verify otp m h error", error)
            next(error)
        }
}