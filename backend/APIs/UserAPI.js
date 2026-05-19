// Create min-express app
import express from "express";
import { UserModel } from "../models/UserModel.js";
export const userRoute = express.Router();
// USER API ROUTES

// Create user
userRoute.post('/users', async(req,res)=>{
    let userObj = req.body;
    const userDoc = new UserModel(userObj);
    let user = await userDoc.save()
    res.status(201).json({message : "User created", payload: user})
})

// Read all users (include active and deleted users)
userRoute.get('/users',async(req,res)=>{
    let usersList = await UserModel.find().sort({createdAt:-1})
    res.status(200).json({message : "users", payload : usersList})
})

// Read a user by ID
userRoute.get('/users/:id',async(req,res)=>{
    let uid = req.params.id
    let user = await UserModel.findById(uid)
    if(!user){
        return res.status(404).json({message : "user not found"})
    }
    res.status(200).json({message : "user found", payload : user})
})

// Soft delete a user by ID
userRoute.delete('/users/:id',async(req,res)=>{
    let uid = req.params.id
    let user = await UserModel.findByIdAndUpdate(uid, {$set : {status : false}},{new:true})
    if (!user){
        return res.status(404).json({message : "user not found"})
    }
    res.status(200).json({message : "user deleted", payload: user})
})

// Restore a deleted user by ID
userRoute.patch('/users/:id/restore',async(req,res)=>{
    let uid = req.params.id
    let user = await UserModel.findByIdAndUpdate(uid, {$set : {status : true}},{new : true})
    if (!user){
        return res.status(404).json({message : "user not found"})
    }
    res.status(200).json({message : "user restored", payload: user})
})

// Update user by ID
userRoute.put('/users/:id', async(req,res)=>{
    let uid = req.params.id
    let updatedUser = req.body
    let user = await UserModel.findByIdAndUpdate(uid, updatedUser, {
        new: true,
        runValidators: true,
        context: 'query'
    })
    if(!user){
        return res.status(404).json({message: "user not found"})
    }
    res.status(200).json({message: "user updated", payload: user})
})