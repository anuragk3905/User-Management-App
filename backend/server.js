// Create HTTP Server
import express from "express";
import { connect } from "mongoose";
import {config} from "dotenv";
import { userRoute } from "./APIs/UserAPI.js";
import cors from 'cors';
config(); //process.env



const app = express();

// add cors
const allowedOrigins = [
  'http://localhost:5173',
  'https://user-management-app-tau-henna.vercel.app',
]
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS policy: Origin not allowed'))
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
  credentials: true,
}))

// Add body parser middleware
app.use(express.json())

// Forward req to UserAPI if path starts with/user-api
app.use('/user-api', userRoute)

// Connect to DB
const connectDB = async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB Connection Successful")
        const port = process.env.PORT || 3000
        app.listen(port,()=>console.log(`Server started on port ${port}`))
    }catch(err){
        console.error("Err in DB connection",err)
        process.exit(1)
    }
}
connectDB();

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err)
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
      error: err.keyValue,
    });
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});