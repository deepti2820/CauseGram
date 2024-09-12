import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

function CreateEvent() {
    const [location,setLocation]=useState("");
    const[date,setDate]=useState("")
    const[image,setImage]=useState("");
    const [url1,setUrL]=useState("");
    const[name,setName]=useState("");
    const loadfile=(event)=>{
        var output = document.getElementById('output');
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function() {
          URL.revokeObjectURL(output.src) // free memory
        };
    }
    const{causeid}=useParams()
    const navigate=useNavigate()
    const {url}=useContext(StoreContext)

    const dateRegix=/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/

    const[user,setUser]=useState("")
    var profilePic="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    useEffect(()=>{
        const token = localStorage.getItem("jwt");
        if (!token) {
          return navigate("/signup");
        }

        
          //saving post to mongodb
        if(url1){
        fetch(`${url}/${causeid}/addEvent`,{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                name:name,
               photo: url1,
               location:location,
               date:date
            })
        }).then(res=>res.json())
        .then(data=>{
            setImage("");
            setUrL("");
            setLocation("")
            setDate("");
            if(data.success){
                toast.success(data.message);
                navigate(`/causeProfile/${causeid}`);
            }else{
                toast.error(data.message)
            }
        })
        .catch(err=>console.log(err))

    }

    },[url1])

    //posting image to cloudinary
    const postDetails=()=>{
        const data=new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","deeptivedanshcloud")

        if(!image || !location ||!name ||!date){
            return toast.error("Please add all field")
        }
        
        if(date.length>0 && !dateRegix.test(date)){
            toast.error("Enetr date like yyyy-mm-dd")
        }

        fetch("https://api.cloudinary.com/v1_1/deeptivedanshcloud/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>setUrL(data.url))
        .catch(err=>console.log(err))
    }


    useEffect(()=>{
        
        fetch(`${url}/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
            headers: {
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
          })
          .then(res=>res.json())
          .then(result=>{
            // console.log(result)
            setUser(result.user)
           })
    },[])

    // console.log(user)
   

    return (
        <div className='create-post' style={{width:"500px"}}>
            <div className="post-header">
                <h4 style={{margin:"3px auto"}}>Create Event</h4>
                <button id="post-btn" onClick={postDetails}>Create</button>
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
                    <h5>{user.name}</h5>
                </div>
                <input type="text" value={name} placeholder='Enter Event name' onChange={(e)=>{setName(e.target.value)}} />
                <input type="text" value={location} placeholder='Enter Location' onChange={(e)=>{setLocation(e.target.value)}} />
                <input type="text" value={date} placeholder='Enter Date' onChange={(e)=>{setDate(e.target.value)}} />
               
            </div>
        </div>
      )

}

export default CreateEvent