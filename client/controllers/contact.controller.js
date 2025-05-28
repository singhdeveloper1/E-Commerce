import Contact from "../models/contact.model.js"
import { errorHandler } from "../utils/errorHandler.js"

//! make contact
export const makeContact = async (req, res, next)=>{
    const {name, email, phone, message} = req.body

    if(phone.toString().length > 10) return next(errorHandler(400, "phone no. must not be greater than 10 digit"))
        if(phone.toString().length < 10) return next(errorHandler(400, "phone no. must not be less than 10 digit"))
    try {

        const existingContact = await Contact.findOne({userId : req.user._id})

        if(existingContact){
            existingContact.contact.push({
                name,
                email,
                phone,
                message
            })
            await existingContact.save()
            return res.status(200).json("message send successfully")
        }
        else{
            const contact = new Contact({
                userId : req.user._id,
                contact : [{
                    name,
                    email,
                    phone,
                    message
                }]
            })
            await contact.save()
            return res.status(200).json("message send successfully!!")
        }

    } catch (error) {
        console.log("make contact m h error", error)        
        next(error)
    }
}

//! view contact
export const viewContact = async (req, res, next)=>{
    const tenDaysAgo = new Date()
    tenDaysAgo.setDate(tenDaysAgo.getDate()-10)

    try {
        const contact = await Contact.aggregate([
            {
                $match : {userId : req.user._id}
            },
            {
                $unwind : "$contact"
            },
            {
                $match : {"contact.sentTime" : {$gte : tenDaysAgo}}
            },
            {
                $replaceRoot : {
                    newRoot : "$contact"
                }
            }
        ])
        res.status(200).json(contact)
    } catch (error) {
        console.log("view contact m h error", error)
        next(error)
    }
}