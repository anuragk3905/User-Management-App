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
        unique : [true, "Email already exists"]
    },
    dateOfBirth:{
        type : Date,
        required : [true, "Date of birth is required"]
    },
    mobileNumber:{
        type : Number
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