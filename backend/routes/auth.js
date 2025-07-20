import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// for sign-up
router.post('/signup',async(req,res)=>{
    const {email,password} = req.body;
    try{
        const userexists = await User.findOne({email});
        if(userexists) return res.status(400).json({message:"User already exists"});

        const hashepass = await bcrypt.hash(password,12);
        const newUser = new User({email,password:hashepass});
        await newUser.save();

        res.status(201).json({message:"User created succesfully"});
    }catch(error){
        res.status(500).json({message:"Something went wrong"});
    }
});


// for login
router.post('/login',async(req,res)=>{
    const {email,password}  = req.body;

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message:"user not found"});
        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch) return res.status(400).json({message:"password is not valid"});


        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'5d'});
        res.json({token});
    }catch(error){
        res.status(500).json({message:"login failed"});
    }
});

export default router;
