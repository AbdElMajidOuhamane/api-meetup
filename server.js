const express=require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const cloudinary =require("cloudinary");
const dotenv =require("dotenv").config()
const app =express();




connectDb()
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_KEY,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})
const port =process.env.PORT || 5000
app.use(express.json())
app.use("/api/contacts",require("./routes/contactRoutes"))
app.use("/api/users",require("./routes/userRoutes"))
app.use(errorHandler);


app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

