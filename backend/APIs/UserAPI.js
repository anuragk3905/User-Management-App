// Create min-express app
import express from "express";
import { UserModel } from "../models/UserModel.js";
export const userRoute = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
};

// USER API ROUTES

// Create user
userRoute.post('/users', asyncHandler(async (req, res) => {
    const userObj = req.body;
    const userDoc = new UserModel(userObj);
    const user = await userDoc.save()
    res.status(201).json({message : "User created", payload: user})
}))

// Read all users (include active and deleted users)
userRoute.get('/users', asyncHandler(async (req, res) => {
    const usersList = await UserModel.find().sort({createdAt:-1})
    res.status(200).json({message : "users", payload : usersList})
}))

// Read a user by ID
userRoute.get('/users/:id', asyncHandler(async (req, res) => {
    const uid = req.params.id
    const user = await UserModel.findById(uid)
    if(!user){
        return res.status(404).json({message : "user not found"})
    }
    res.status(200).json({message : "user found", payload : user})
}))

// Soft delete a user by ID
userRoute.delete('/users/:id', asyncHandler(async (req, res) => {
    const uid = req.params.id
    const user = await UserModel.findByIdAndUpdate(uid, {$set : {status : false}},{new:true})
    if (!user){
        return res.status(404).json({message : "user not found"})
    }
    res.status(200).json({message : "user deleted", payload: user})
}))

// Restore a deleted user by ID
userRoute.patch('/users/:id/restore', asyncHandler(async (req, res) => {
    const uid = req.params.id
    const user = await UserModel.findByIdAndUpdate(uid, {$set : {status : true}},{new : true})
    if (!user){
        return res.status(404).json({message : "user not found"})
    }
    res.status(200).json({message : "user restored", payload: user})
}))

// Update user by ID
userRoute.put('/users/:id', asyncHandler(async (req, res) => {
    const uid = req.params.id
    const updatedUser = req.body
    const user = await UserModel.findByIdAndUpdate(uid, updatedUser, {
        new: true,
        runValidators: true,
        context: 'query'
    })
    if(!user){
        return res.status(404).json({message: "user not found"})
    }
    res.status(200).json({message: "user updated", payload: user})
}))