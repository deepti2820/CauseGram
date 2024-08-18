import React, { useEffect, useState } from 'react'
import "./Post.css"
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function Post() {
    const loadfile=(event)=>{
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
          URL.revokeObjectURL(output.src) // free memory
        };
    }

    const navigate=useNavigate();


    const[body,setBody]=useState("");
    const[image,setImage]=useState("");
    const [url,setUrL]=useState("");
    const[hashtag,setHashtag]=useState('');

    useEffect(()=>{
        const token = localStorage.getItem("jwt");
        if (!token) {
          return navigate("/signup");
        }
        
          //saving post to mongodb
        if(url){
        fetch("http://localhost:5000/createPost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                body:body,
               photo: url,
               hashtag:hashtag,
            })
        }).then(res=>res.json())
        .then(data=>{
            setBody("");
            setImage("");
            setUrL("");
            setHashtag("");
            if(data.success){
                toast.success(data.message);
                navigate("/");
            }else{
                toast.error(data.message)
            }
        })
        .catch(err=>console.log(err))

        fetch(`http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
            headers: {
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
          })
          .then(res=>res.json())
          .then(result=>{
            setUser(result.user)
           })
    }

    },[url])

    //posting image to cloudinary
    const postDetails=()=>{
        const data=new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","deeptivedanshcloud")

        if(!image || !body){
            return toast.error("Please add all field")
        }
        fetch("https://api.cloudinary.com/v1_1/deeptivedanshcloud/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>setUrL(data.url))
        .catch(err=>console.log(err))

      

    }

    const[user,setUser]=useState("");

  var profilePic="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"

  return (
    <div className='create-post' style={{width:"500px"}}>
        <div className="post-header">
            <h4 style={{margin:"3px auto"}}>Create New Post</h4>
            <button id="post-btn" onClick={postDetails}>Share</button>
        </div>

        <div className="main-div">
        <img  id="output" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrVLGzO55RQXipmjnUPh09YUtP-BW3ZTUeAA&s"/>
            <input type="file"  accept='image/*' onChange={(event)=>{loadfile(event)
                setImage(event.target.files[0])
            }}/>
           

        </div>

        <div className="details">
            <div className="card-header">
                <div className="card-pic">
                    <img src={user.Photo?user.Photo:profilePic} alt="" />
                </div>
                <h5>Deepti</h5>
            </div>

            <textarea value={body} style={{borderBottom:"1px solid black ", padding:"0 25px" ,width:"497px"}} onChange={(e)=>{setBody(e.target.value)}} type="text" placeholder='Write a caption'></textarea>
            {/* <hr style={{color:"black"}}/> */}
            {/* <div> */}
            <textarea value={hashtag} style={{padding:"0 25px",width:"497px"}} onChange={(e)=>{setHashtag(e.target.value)}} type="text" placeholder='Add HashTags'></textarea>
            {/* </div> */}
           
        </div>
    </div>
  )
}

export default Post