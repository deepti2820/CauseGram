const jwt=require("jsonwebtoken")
const Jwt_secret="deeptivedansh";
const mongoose=require("mongoose")
const userModel=require("../models/userModel")


module.exports=(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization){
        return res.json({success:false,message:"You need to login firts"})
    }

    const token=authorization.replace("Bearer ","")
     jwt.verify(token,Jwt_secret,(err,payload)=>{
        if(err){
            return res.json({success:false,message:"You need to login firts"})
        }
        const{_id}=payload;

         userModel.findById(_id)
        .then(userData=>{
            req.user=userData
            next()
        })

    })
}