
if(process.env.NODE_ENV!=='production'){
  require('dotenv').config();
}
const express=require("express");
const app=express();
const PORT=process.env.PORT || 4000;

const cors=require("cors");
const mongoose=require("mongoose");
const User=require("./models/userModel");
const Post=require("./models/postModel")
const authRoute=require("./routes/auth");
const createRoute=require("./routes/createPost");
const userRoute=require("./routes/user");
const chatRoutes=require("./routes/chatRoutes");
const messageRoutes=require("./routes/messageRoutes");
const causeRoutes=require("./routes/causeRoute")
const eventRoutes=require("./routes/eventRoutes")
const dbUrl=process.env.dbUrl;
mongoose.connect(dbUrl)
.then(()=>{
    console.log("Connected");
})
.catch((error)=>{
    console.log(error);
})

app.use(express.json())
app.use(cors());

app.get("/",(req,res)=>{
    res.json("data")
})

app.use(authRoute)
app.use(createRoute)
app.use(userRoute)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)
app.use("/causeProfile",causeRoutes)
app.use(eventRoutes)






const server=app.listen(PORT,()=>{
    console.log("Server is running on port 5000");
})




const io=require('socket.io')(server,{
    pingTimeout:60000,

    cors:{
        origin:"http://localhost:5173",
    }
})

io.on("connection",(socket)=>{
    console.log("Connected to socket.io")

    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat",(room)=>{
        socket.join(room);
    })

    socket.on('typing',(room)=>{
        socket.in(room).emit("typing")
    })

    socket.on('stop typing',(room)=>{
        socket.in(room).emit("stop typing")
    })

    socket.on("new message",(newMessageRecieved)=>{
        var chat=newMessageRecieved.chat;

        if(!chat.users) return console.log("Chats users not defined");

        chat.users.forEach(user=>{
            if(user._id== newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved",newMessageRecieved)
        })

    })

    socket.off("setup",()=>{
        console.log("Dissconnected")
        socket.leave(userData._id)
    })
})
