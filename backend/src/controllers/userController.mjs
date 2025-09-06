import userModel from "../models/userModel.mjs";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { secretToken } from "../../config.mjs";
const registerUser=async (req,res)=>{
    try {
        let {name,email,password,role,phone}=req.body;
        // console.log(req.body)
        if(!name){
            return res.status(400).send({status:"failed",message:"Name is required"});
        }
        if(!email){
            return res.status(400).send({status:"failed",message:"Email is required"});
        }
         if(!password){
            return res.status(400).send({status:"failed",message:"Password is required"});
        }
         if(!role){
            return res.status(400).send({status:"failed",message:"Role is required"});
        }
        if(!phone){
            return res.status(400).send({status:"failed",message:"Phone is required"});
        }

        password= await bcrypt.hash(password, 10);
        // console.log(password)
        const createdUser= await userModel.create({name,email,password,role,phone});
        return res.status(201).send({status:"ok",message:"User registered successfully"});
    } catch (error) {
        if(error.message.includes('validation')){
            return res.status(400).send({status:"failed",message:error.message});
        }else  if(error.message.includes('duplicate')){
            return res.status(400).send({status:"failed",message:error.message});
        }else{
            return res.status(500).send({status:"failed",message:error.message});
        }
    }
}

const loginUser=async (req,res)=>{
    try {
        const {email,password }= req.body;
        const user= await userModel.findOne({email:email});
        if(!user){
            return res.status(400).send({status:"failed",message:"user does not exist"});
        }
        let hashcode= user.password;
        // console.log(hashcode);
        let check= await bcrypt.compare(password,hashcode);
        // console.log(check)
        if(!check){
            return res.status(400).send({status:"failed",message:"invalid credentials"});
        }
        let token = jwt.sign({role:user.role,id:user._id},secretToken,{expiresIn:'24h'});
        if(!token){
            return res.status(500).send({status:"failed",message:"try in some time"});
        }
        let data={name:user.name, email:user.email, role:user.role, phone:user.phone, token:token,id:user._id};
        // req.headers.setHeader("auth-token",token);
        return res.status(200).send({status:"ok",data:data});

    } catch (error) {
         if(error.message.includes('validation')){
            return res.status(400).send({status:"failed",message:error.message});
        }else  if(error.message.includes('duplicate')){
            return res.status(400).send({status:"failed",message:error.message});
        }else{
            return res.status(500).send({status:"failed",message:error.message});
        }
    }
}
const updateUser = async (req, res) => {
  try {
    const { name, role, phone } = req.body;
    const userId = req.user.id; // authentication se milega

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { name, role, phone } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).send({ status: "failed", message: "User not found" });
    }

    return res.status(200).send({ status: "ok", data: updatedUser });
  } catch (error) {
    return res.status(500).send({ status: "failed", message: error.message });
  }
};

const getProfile= async(req,res)=>{
    try {
        const id= req.params.id;
        const user= await userModel.findById(id).select("-password");
        if(!user){
            return res.status(404).send({status:"failed",message:"User not found"});
        }
        return res.status(200).send({status:"ok",data:user});
    } catch (error) {
         if(error.message.includes('validation')){
            return res.status(400).send({status:"failed",message:error.message});
        }else  if(error.message.includes('duplicate')){
            return res.status(400).send({status:"failed",message:error.message});
        }else{
            return res.status(500).send({status:"failed",message:error.message});
        }
    }
}
import User from '../models/userModel.mjs'

// ...existing code...

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, email, photo } = req.body

    // Check if email is being updated and is unique
    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: userId } })
      if (existing) {
        return res.status(400).json({ message: 'Email already in use.' })
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { name, email, photo } },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({ user: updatedUser })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.' })
  }
}
export {registerUser,loginUser,updateUser,getProfile}