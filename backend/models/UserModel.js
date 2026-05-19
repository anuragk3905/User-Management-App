import {Schema, model} from "mongoose";
// Create User Schema
//name, email, date of birth, mobile number
const userSchema = new Schema({
    name:{
        type : String,
        required : [true, "Name is required"]
    },
    email:{
        type : String,
        required : [true, "Email is required"],
        unique : [true, "Email already exists"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    dateOfBirth:{
        type : Date,
        required : [true, "Date of birth is required"]
    },
    mobileNumber:{
        type : String,
        required: [true, 'Mobile number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits']
    },
    status:{
        type : Boolean,
        default : true
    }
},{
    timestamps : true,
    versionKey : false,
    strict : "throw"
})

// Create User Model for User Schema
export const UserModel = model("user",userSchema)