const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const userModel=require("../models/userModel")
const bcrypt=require('bcrypt')
const jwt=require("jsonwebtoken");
const validator=require("validator")


const Jwt_secret="deeptivedansh";

router.get("/",(req,res)=>{
    res.send("Hello")
})


router.post("/signup",async(req,res)=>{
    const {name,email,password,username}=req.body;

    if(!name || !email || !username || !password){
        return res.json({success:false,message:"Please add all field"})
    }

    const findUser=await userModel.findOne({$or:[{email:email},{username:username}]});
    if(findUser){
        return res.json({message:"User already exists that email or username"})
    }
    if(!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter valid email"})
    }

    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(password,salt);
    try{
       const newUser= userModel({name,email,password:hashedPassword,username});
        await newUser.save()
        res.json({success:true,message:"Register Successfully"});
    }
    catch(error){
        res.json({success:false,message:"Error"})
    }

})


router.post("/signin",async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.json({success:false,message:"Please add all field"})
    }
   
    const user=await userModel.findOne({email:email});
    if(!user){
        res.json({success:false,message:"Invalid Details"});
    }
    const compare=await bcrypt.compare(password,user.password)
    if(compare){
        const token=jwt.sign({_id:user.id},Jwt_secret)
        const {_id,name,email,username}=user;
       return  res.json({success:true,message:"Signin Successfully",token:token,user: {_id,name,email,username}});
    }else{
        return res.json({success:false,message:"Invalid Details"});
   
    
    }

})

router.post("/googleLogin",async(req,res)=>{
    const {email_verified,emailP,clientId,userName,Photo,nameP}=req.body

    if(email_verified){
        const user=await userModel.findOne({email:emailP});
        if(user){
            const token=jwt.sign({_id:user.id},Jwt_secret)
            const {_id,name,email,username}=user;
           return  res.json({success:true,message:"Signin Successfully",token:token,user: {_id,name,email,username}});
        }else{
            const password=emailP+clientId;
            try{
                const newUser= userModel({name:nameP,email:emailP,password,username:userName,Photo});
                 await newUser.save()
                 let userId=newUser._id.toString();
                 const token=jwt.sign({_id:userId},Jwt_secret)
                 const {_id,name,email,username}=newUser;
                return  res.json({success:true,message:"Signin Successfully",token:token,user: {_id,name,email,username}});
             }
             catch(error){
                console.log(error)
                 res.json({success:false,message:error})
             }
        }
    }
})

module.exports=router;