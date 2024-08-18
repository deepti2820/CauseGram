const mongoose = require("mongoose");

const evenstModel=mongoose.Schema(
    {
        eventName:{
            type:String,
            trim:true
        },
        photo:{
            type:String,
            trim:true,
            require:true
        },
        location:{
            type:String,
            trim:true
        },
        loc: {
            type: {
                type: String, // This is required, and should be set to 'String'
                enum: ['Point'], // 'Point' is the only type allowed for GeoJSON
                required: true
            },
            coordinates: {
                type: [Number], // Array of numbers: [longitude, latitude]
                required: true
            }
        },
        admin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        date:{
            type:String,
            trim:true
        },
      
        users:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
    },
    {
        timestamps:true,
    }
)

const Events=mongoose.model("Events",evenstModel);

module.exports=Events;