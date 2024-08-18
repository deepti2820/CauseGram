const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types


const reelSchema=new mongoose.Schema({
   
    body:{
        type:String,
        required:true
    },
    video:{
        type:String,
        require:true
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    },
    likes:[{type:ObjectId,ref:"User"}],

    comments:[{
        comment:{type:String},
        postedBy:{
            type:ObjectId,
            ref:"User"
        }
    }],
},{timestamps:true})



const Reel=mongoose.model("Reel",postSchema)

module.exports=Reel

