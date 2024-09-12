import React, { useContext, useEffect, useState } from 'react'
import "./Profile.css"
import PostDetail from './PostDetail.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext.jsx';
function UserProfile() {

    const {userid}=useParams()
  const[user,setUser]= useState("")
  const[post,setPost]=useState([])
  const[isFollow,setIsFollow]=useState(false);
  const navigate=useNavigate();
  const {url}=useContext(StoreContext)

  var profilePic="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"


  const followUser=(userId)=>{
    fetch(`${url}/follow`,{
        method:"put",
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            followId:userId
        })
    })
    .then((res)=>{res.json()})
    .then((data)=>{
        console.log(data);
        setIsFollow(true)
    })
  }

  const unfollowUser=(userId)=>{
    fetch(`${url}/unfollow`,{
        method:"put",
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            followId:userId
        })
    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data);
        setIsFollow(false)
    })
  }


  useEffect(()=>{
    const token = localStorage.getItem("jwt");
    console.log(token)
    if (!token) {
      return navigate("/signup");
    }


    if(userid!==(JSON.parse(localStorage.getItem("user"))._id)==0){
        return navigate("/profile")
    }

    fetch(`${url}/user/${userid}`,{
      headers: {
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
    })
    .then(res=>res.json())
    .then(result=>{
        console.log(result)
      setUser(result.user);
      setPost(result.posts);
      if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
        setIsFollow(true)
      }
     })
  },[isFollow])
//   console.log(user)
  return (
    <div className='profile'>
      {/* Profile frame */}

      <div className="profile-frame">
        <div className="profile-pic" style={{width:"30%"}}>
          <img src={user.Photo?user.Photo:profilePic} alt="" />
        </div>

        <div className="profile-data">
            <div style={{display:"flex", alignItems:"center",justifyContent:"space-between"}}>
                <h1>{user.name}</h1>
                <button onClick={()=>{
                    if(isFollow){
                        unfollowUser(user._id)
                        
                    }else{
                        followUser(user._id)
                       
                    }
                    
                }} 
                    className="followBtn">{
                    isFollow?"Unfollow":"Follow"
                }
                </button>
            </div>
          
          <div className="profile-info">
            <p>{post.length}posts</p>
            <p>{user.followers?user.followers.length:"0"} followers</p>
          
            
            <p>{user.following?user.following.length:"0"} following</p>
          </div>
        </div>
      </div>

      <hr style={{width:"90%",margin:"25px auto",opacity:"0.8"}}/>

      <div className="gallery">
        {
          post.map((data)=>{
            return (
              <img key={data._id} src={data.photo}
                // onClick={()=>toggleDetails(data)}
              ></img>
            )
          })
        }
      </div>
     
     {/* {

      show && <PostDetail item={post} toggleDetails={toggleDetails}></PostDetail>


     } */}
    </div>
  )
}

export default UserProfile