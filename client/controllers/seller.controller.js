import User from "../models/user.model.js"

export const switchToUser = async (req, res, next)=>{
    try {
        await User.findByIdAndUpdate(req.user._id,{
            isSeller : false
        },{new : true})

        res.status(200).json("switched to user successfully!!!")
    } catch (error) {
        console.log("switch to user m h error", error)
        next(error)
    }
}

