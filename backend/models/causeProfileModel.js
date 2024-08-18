const mongoose = require("mongoose");

const causeProfileModel=mongoose.Schema(
    {
        photo:{
            type:String,
            require:true
        },
        causeName:{
            type:String,
            trim:true
        },
       
        description:{
            type:String,
        },
       donations:{
            type:String,
        },
        admin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        users:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            unique:true
        }],
        hashtags: [String],
        events:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Events"
            }
        ]
    },
    {
        timestamps:true,
    }
)

const CauseProfile=mongoose.model("CauseProfile",causeProfileModel);

module.exports=CauseProfile;