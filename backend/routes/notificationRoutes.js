const express=require('express');
const router=express.Router()
const requireLogin = require("../middleware/requireLogin");
const notificationModel=require("../models/notificationModel")

router.get("/allnotifications",requireLogin,async(req,res)=>{

})


router.post("/",requireLogin,async(req,res)=>{
    
})



module.exports = router;
