// Create min-express app
import express from "express";
import { UserModel } from "../models/UserModel.js";
export const userRoute = express.Router();
// USER API ROUTES

// Create user
userRoute.post('/users', async(req,res)=>{
    //get user obj from req
    let userObj = req.body;
    //create document
    const userDoc = new UserModel(userObj);
    // save new user
    let user = await userDoc.save()
    // send res
    res.status(201).json({message : "User created", payload: user})
})

// Read all users
userRoute.get('/users',async(req,res)=>{
    // read all users
    let usersList = await UserModel.find({status:true})
    // send res
    res.status(200).json({message : "users", payload : usersList})
})

// Read a user by ID
userRoute.get('/users/:id',async(req,res)=>{
    // get user id from url
    let uid = req.params.id
    // find user by id
    let user = await UserModel.findOne({_id:uid,status:true})
    // check user
    if(!user){
        return res.status(404).json({message : "user not found"})
    }
    // send res
    res.status(200).json({message : "user found", payload : user})
})

// Delete a user by ID
userRoute.delete('/users/:id',async(req,res)=>{
    // get user id from url
    let uid = req.params.id
    // find user by id
    let user = await UserModel.findByIdAndUpdate(uid, {$set : {status : false}})
    if (!user){
        return res.status(404).json({message : "user not found"})
    }
    // send res
    res.status(200).json({message : "user deleted"})
})

// Activate user(change status to true)
userRoute.patch('/users/:id',async(req,res)=>{
    // get user id from url
    let uid = req.params.id
    // find user by id
    let user = await UserModel.findByIdAndUpdate(uid, {$set : {status : true}},{new : true})
    // send res
    res.status(200).json({message : "user activated", payload: user})
})

// Update user by ID