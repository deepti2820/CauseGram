const mongoose = require("mongoose");

const donationModel=mongoose.Schema(
    {
        
       amount:{
            type:String,
        },
        users:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        causeId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"CauseProfile"
        },
        
    },
    {
        timestamps:true,
    }
)

const Donation=mongoose.model("Donation",donationModel);

module.exports=Donation;