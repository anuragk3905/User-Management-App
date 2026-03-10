// Create HTTP Server
import express from "express";
import { connect } from "mongoose";
import {config} from "dotenv";
import { userRoute } from "./APIs/UserAPI.js";
import cors from 'cors';
config(); //process.env



const app = express();

// add cors
app.use(cors({
  origin: ['http://localhost:5173']
}))

// Add body parser middleware
app.use(express.json())

// Forward req to UserAPI if path starts with/user-api
app.use('/user-api', userRoute)

// Connect to DB
const connectDB = async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB Connection Succesful")
        //start http server
        app.listen(process.env.PORT,()=>console.log("Server started"))
    }catch(err){
        console.log("Err in DB connection",err)
    }
}
connectDB();

// Add error handling middleware
app.use((err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors,
    });
  }
  // Invalid ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }
  // Duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate field value",
    });
  }
  res.status(500).json({
    message: "Internal Server Error",
  });
});