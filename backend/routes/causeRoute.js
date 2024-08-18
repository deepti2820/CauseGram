const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const causeProfileModel= require("../models/causeProfileModel");
const getTrendingHashtags = require("../middleware/trendingHashtag");
const donationModel=require("../models/donationsModel")

router.post("/create", requireLogin, async (req, res) => {
  const { photo, body,hashtag ,name} = req.body;
  // console.log(hashtag.split('#'))
  if (!photo || !body || !name) {
    return res
      .status(422)
      .json({ success: false, message: "Please add all filed" });
  }
  try {
    const newCause = causeProfileModel({causeName:name, photo, description:body, admin: req.user,hashtags: hashtag && hashtag.split('#')});
    await newCause.save();
    res.json({ success: true, message: "Cause Profile Created Successfully" });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" });
  }
});

router.get("/allcauses",requireLogin,async(req,res)=>{
    
    const causes = await causeProfileModel.find()
    // console.log(causes)
    res.send(causes);
})


router.get("/:causeid",requireLogin,async(req,res)=>{
  const {causeid}=req.params;
  const causes = await causeProfileModel.findById(causeid).populate("events","_id eventName photo location date users");
    // console.log(causes)
    res.send(causes);
})


router.put("/:causeid/follow",requireLogin,async(req,res)=>{
  const {causeid}=req.params;
  try{
     const followCause=await causeProfileModel.findByIdAndUpdate(causeid,{
          $push:{users:req.user._id}
      },{
          new :true
      });

      if(!followCause){
          return res.status(404).json({ error: 'User to follow not found' });
      }

    const cause=await followCause.populate("events","_id eventName photo location date users");

      res.json(cause)
  }catch (err) {
      console.error(err); // Log the error for debugging purposes
      res.status(422).json({ error: 'An error occurred while processing your request' });
  }
  
})


router.put("/:causeid/unfollow",requireLogin,async(req,res)=>{
  const {causeid}=req.params;
  try{
     const followCause=await causeProfileModel.findByIdAndUpdate(causeid,{
          $pull:{users:req.user._id}
      },{
          new :true
      });

      if(!followCause){
          return res.status(404).json({ error: 'User to follow not found' });
      }
      const cause=await followCause.populate("events","_id eventName photo location date users");
      res.json(cause)
  }catch (err) {
      console.error(err); // Log the error for debugging purposes
      res.status(422).json({ error: 'An error occurred while processing your request' });
  }
  
})

router.post("/donate/:causeid",requireLogin,async(req,res)=>{
  const {causeid}=req.params;
  const{amount}=req.body;
  if (!amount) {
    return res
      .status(422)
      .json({ success: false, message: "Please add all filed" });
  }
  try {
    const newDonation = donationModel({user: req.user,amount,causeId:causeid});
    await newDonation.save();
    const cause=await causeProfileModel.findById(causeid);
    const newAmount=Number(amount)+Number(cause.donations);
    // console.log(newAmount)
    const followCause=await causeProfileModel.findByIdAndUpdate(causeid,{
      $set:{donations:newAmount}
  },{
      new :true
  });

  if(!followCause){
      return res.status(404).json({ error: 'Cause not found' });
  }
    res.json({ success: true, message: "Donate Successfully" });
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: "Error" });
  }
})

module.exports=router