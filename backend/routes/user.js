const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const postModel=require("../models/postModel")
const userModel=require("../models/userModel");
const requireLogin = require("../middleware/requireLogin");


//to get user profile
router.get("/user/:id",async(req,res)=>{
   
    try {
        const user = await userModel.findOne({ _id: req.params.id }).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await postModel.find({ postedBy: req.params.id }).populate('postedBy', '_id');
        console.log(user)
        res.status(200).json({ user, posts });
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//to follow user

router.put("/follow",requireLogin,async(req,res)=>{
    try{
       const followUser=await userModel.findByIdAndUpdate(req.body.followId,{
            $push:{followers:req.user._id}
        },{
            new :true
        });

        if(!followUser){
            return res.status(404).json({ error: 'User to follow not found' });
        }

        const currentUser=await userModel.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new :true
        });
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }
        res.json(currentUser)
    }catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(422).json({ error: 'An error occurred while processing your request' });
    }
    
})


// to unfollow user


router.put("/unfollow",requireLogin,async(req,res)=>{
    try{
       const followUser=await userModel.findByIdAndUpdate(req.body.followId,{
            $pull:{followers:req.user._id}
        },{
            new :true
        });

        if(!followUser){
            return res.status(404).json({ error: 'User to unfollow not found' });
        }

        const currentUser=await userModel.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.followId}
        },{
            new :true
        });
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }
        res.json(currentUser)
    }catch (err) {
        console.error(err); // Log the error for debugging purposes
        res.status(422).json({ error: 'An error occurred while processing your request' });
    }
    
})



router.put("/uploadProfilePic",requireLogin,async(req,res)=>{
    try {
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            { $set: { Photo: req.body.photo } },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get("/search",requireLogin,async(req,res)=>{
    try{
        const users=await userModel.find({});
        res.json({success:true,users:users})
    }catch(error){
        res.json({success:false,message:error})
    }
})

router.get("/api/user",requireLogin,async (req, res) => {
    console.log(req.query.search)
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

      console.log(keyword)
     
    const users = await userModel.find(keyword).find({ _id: { $ne: req.user._id } });
    console.log(users+"yuyhuyh")
    res.send(users);
  });


// const allUsers = asyncHandler(async (req, res) => {
//     console.log(req.query.search)
//     const keyword = req.query.search
//       ? {
//           $or: [
//             { name: { $regex: req.query.search, $options: "i" } },
//             { email: { $regex: req.query.search, $options: "i" } },
//           ],
//         }
//       : {};

//       if (req.headers['chat-user']) {
//         try {
//           req.chatUser = JSON.parse(req.headers['chat-user']);
//         } catch (error) {
//           console.error('Error parsing chatUser header:', error);
//           return res.status(400).json({ message: 'Invalid chatUser data' });
//         }
//       }
  
//     const users = await User.find(keyword).find({ _id: { $ne: req.chatUser._id } });
//     res.send(users);
//   });




module.exports=router;