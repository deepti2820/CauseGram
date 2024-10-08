const mongoose=require("mongoose")
 const User = require("./userModel")
const {ObjectId}=mongoose.Schema.Types


const postSchema=new mongoose.Schema({
   
    body:{
        type:String,
        required:true
    },
    photo:{
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
    hashtags: [String],
},{timestamps:true})



const Post=mongoose.model("Post",postSchema)

module.exports=Post

