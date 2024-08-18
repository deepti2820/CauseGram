const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    username:{
        type:String,
        require:true
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    Photo:{
        type:String,
    },
    causeId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CauseProfile"
    }],
    events:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Events"
        }
    ]
})

const User=mongoose.model("User",userSchema)

module.exports=User