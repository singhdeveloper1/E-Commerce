import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    email : {
        type : String,
    },

    phone : {
        type : String
    },

    password : {
        type : String,
        required : true
    }
},{timestamps : true})

userSchema.pre("save",async function(next){
    try {
        if(!this.isModified("password"))  return next()

            this.password = await bcrypt.hash(this.password, 10)
            next()
    } catch (error) {
        next(error)
    }
  
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function(){
    return jwt.sign({id : _this._id}, process.env.JWT_SECRET)
}

const User = mongoose.model("User", userSchema)

export default User





