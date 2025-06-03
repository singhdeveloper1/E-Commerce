import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, "public/uploads/")
    },

    filename : (req, file, cb)=>{
        const uniqueName = `${file.originalname}${Math.floor(Math.random()*10)}`
        console.log(uniqueName)
        cb(null,uniqueName)
    }
})

const uploadLocal = multer({storage})

export default uploadLocal