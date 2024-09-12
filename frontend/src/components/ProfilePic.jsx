import React, { useEffect, useRef, useState } from 'react'
import { StoreContext } from '../context/StoreContext';

function ProfilePic({chnageProfile}) {
    const[image,setImage]= useState("");
    const[url1,setUrl]=useState("")
    // useEffect
    const hiddenFileInput=useRef(null)

    const{url}=useContext(StoreContext)

    const postDetails=()=>{
        const data=new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","deeptivedanshcloud")

        if(!image ){
            return toast.error("Please add all field")
        }
        fetch("https://api.cloudinary.com/v1_1/deeptivedanshcloud/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>setUrl(data.url))
        .catch(err=>console.log(err))

    }

    const postPick=()=>{
            fetch(`${url}/uploadProfilePic`,{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                   photo: url1
                })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                chnageProfile()
                window.location.reload()
            })
            .catch(err=>console.log(err))
        
    }

    useEffect(()=>{
        if(image){
            postDetails()
        }
           
    },[image])

    const handleClick=()=>{
        hiddenFileInput.current.click();
    }

    useEffect(()=>{
        if(url1){
            postPick()
        }
    },[url1])
  return (
    <div className='profilePic darkBg'>
        <div className='changePic centered' >
            <div>
                <h2>Change Profile Photo</h2>
            </div>
            <div style={{borderTop:"1px solid #00000030"}}>
                <button onClick={handleClick}  className="upload-btn" style={{color:"#1EA1F7"}}>Upload Photo</button>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={(e)=>setImage(e.target.files[0])} ref={hiddenFileInput}/>
            </div>
            <div style={{borderTop:"1px solid #00000030"}}>
                <button className="upload-btn" style={{color:"#ED4956"}} onClick={()=>{setUrl(null)
                    postPick()}
                }>Remove current photo</button>
            </div>
            <div style={{borderTop:"1px solid #00000030"}}>
                <button onClick={chnageProfile} style={{background:"none",border:"none",cursor:"pointer",fontSize:"15px"}}>Cancel</button>
            </div>
        </div>
        
    </div>
  )
}

export default ProfilePic