import sendMail from "../mailsender/mailsender.js"
import OTP from "../models/otp.model.js"
import { errorHandler } from "../utils/errorHandler.js"

//! get otp
export const getOTP = async (req, res, next) =>{

    const {email, phone} = req.body

    if(!phone && !email) return next(errorHandler(400,"email or phone is required to send otp"))
        

        const otp =  Math.floor(Math.random() * 10000)

        sendMail(email, "OTP for verification!!" , `this is the OTP <h2>${otp}</h2 to verify your email and its only valid for <h3>5 Min</h3>`)

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
    console.log("from body", req.body.otp)

    const existingOTP = await OTP.findOne({$or : [{email, phone}]})
    console.log("from db" , existingOTP.otp)

    if(!existingOTP) return next(errorHandler(404,"otp is not present"))

        const DB_OTP = existingOTP.otp

        // console.log(existingOTP.otp)

        console.log(existingOTP.otp === otp)

      if(otp != DB_OTP) return next(errorHandler(401, "invalid otp"))

        try {
            await OTP.findByIdAndUpdate(existingOTP._id,{
                verified : true,
                expiry : new Date(Date.now() + 5 * 60 * 1000)
            },{new : true})
            res.status(200).json("verifieddd !!!")
        } catch (error) {
            console.log("verify otp m h error", error)
            next(error)
        }
}