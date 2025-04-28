import "dotenv/config"
import app from "./app.js"
import connectDB from "./database/db.js"

connectDB()
const port = process.env.PORT || 5000

app.listen(port,"0.0.0.0", ()=>{
    console.log(`server is running at ${port}`)
})
