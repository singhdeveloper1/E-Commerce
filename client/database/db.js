import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("db is connected")
    } catch (error) {
        console.log("db m h error", error)
    }
}

export default connectDB