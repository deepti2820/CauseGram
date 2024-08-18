const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const eventModel= require("../models/eventsModel");
const causeProfileModel= require("../models/causeProfileModel");
const getLatLog = require("../middleware/getLatLog");


router.post("/:causeid/addEvent", requireLogin, async (req, res) => {
  const { photo, location,date ,name} = req.body;
  const{causeid}=req.params
  if (!photo || !location || !name || !date) {
    return res
      .status(422)
      .json({ success: false, message: "Please add all filed" });
  }
  // const ans=getLatLog(location);
  const latLng = async (address) => {
    const query = encodeURIComponent(address); // Encode the address for use in a URL

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await response.json();

    console.log('Nominatim Response:', data); // Log the entire response to debug

    if (data.length > 0) {
        const location = data[0];
        console.log(`Latitude: ${location.lat}, Longitude: ${location.lon}`);
        return { lat: location.lat, lon: location.lon };
    } else {
        console.error('No location found');
        return null;
    }
};

(async () => {
    try {
        const ans = await latLng(location); // Await the result of latLng

        if (!ans) {
            // Handle the case where no location was found
            return res.json({ success: false, message: "Location not found" });
        }

        const newEvent = eventModel({
            eventName: name,
            photo,
            loc: { type: "Point", coordinates: [ans.lon, ans.lat] }, // Remember, it's [longitude, latitude]
            admin: req.user,
            location,
            date
        });

        await newEvent.save();
        
        await causeProfileModel.findByIdAndUpdate(causeid, {
            $push: { events: newEvent }
        });

        res.json({ success: true, message: "Event Created Successfully" });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.json({ success: false, message: "Error creating event" });
    }
})();


});


router.get("/allLocalEvents",requireLogin,async(req,res)=>{
  console.log(req.query.lng, req.query.lat)
  const events = await eventModel.find({
    loc: {
        $near: {
            $geometry: {
                type: "Point" ,
                coordinates: [req.query.lng, req.query.lat]
            },
            $maxDistance: 10000 // within 10 km
        }
    }
});
res.json(events);
})


router.put("/:eventId/join",requireLogin,async(req,res)=>{
  const {eventId}=req.params;
  const{causeid}=req.body
  try{
     const followEvent=await eventModel.findByIdAndUpdate(eventId,{
          $push:{users:req.user._id}
      },{
          new :true
      });

      if(!followEvent){
          return res.status(404).json({ error: 'User to follow not found' });
      }
      const cause=await causeProfileModel.findById(causeid).populate("events","_id eventName photo location date users");
      res.json(cause)
  }catch (err) {
      console.error(err); // Log the error for debugging purposes
      res.status(422).json({ error: 'An error occurred while processing your request' });
  }
  
})


// router.get("/allcauses",requireLogin,async(req,res)=>{
    
//     const causes = await causeProfileModel.find()
//     console.log(causes)
//     res.send(causes);
// })


// router.get("/:causeid",requireLogin,async(req,res)=>{
//   const {causeid}=req.params;
//   const causes = await causeProfileModel.findById(causeid);
//     console.log(causes)
//     res.send(causes);
// })

module.exports=router