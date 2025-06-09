import User from "../models/user.model.js"
import { errorHandler } from "../utils/errorHandler.js"
import admin from "../utils/firebasePushNotification.js"

//! allow notification
export const allowNotification = async (req, res, next)=>{
    const {fcmToken} = req.body

    try {
        const user = await User.findByIdAndUpdate(req.user._id,{
            $set : {
                fcmToken : fcmToken
            }
        },{new : true})
        res.status(200).json("Notification marked as allowed")
    } catch (error) {
        console.log("allow notification m h error", error)
        next(error)
    }
}

//! send notification
export const sendNotification = async (req, res)=>{
    const {email, title, body} = req.body
    try {
        const user = await User.findOne({email})
        if(user?.fcmToken) return next(errorHandler(400, "notification is disabled by user!!"))

            const message = {
                notification  : {title, body},
                token : user.fcmToken
            }

            const response = await admin.messaging().send(message)
            res.status(200).json("notification send successfullyy!!!", response)
        
    } catch (error) {
        console.log("send notification m h error", error)
        next(error)
    }
}