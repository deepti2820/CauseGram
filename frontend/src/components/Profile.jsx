import React, { useEffect, useState } from 'react'
import "./Profile.css"
// import PostDetail from './PostDetail'
import PostDetail from './PostDetail.jsx';
import ProfilePic from './ProfilePic.jsx';
import { useNavigate } from 'react-router-dom';
function Profile() {

  const[pic,setPic]= useState([])
  const[show,setShow]=useState(false);
  const[post,setPost]=useState([])
  const[user,setUser]=useState("");
  const navigate=useNavigate()
  var profilePic="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  const[changePic,setChangePic]=useState(false)

  const toggleDetails=(post)=>{
    if(show){
      // console.log(post)
      setShow(false);
    }else{
      // console.log(post)

      setShow(true)
      setPost(post)
    }
  }

  const chnageProfile=()=>{
    setChangePic(!changePic)
  }

  useEffect(()=>{

    const token = localStorage.getItem("jwt");
    console.log(token)
    if (!token) {
      return navigate("/signup");
    }

    fetch(`http://localhost:5000/user/${JSON.parse(localStorage.getItem("user"))._id}`,{
      headers: {
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
    })
    .then(res=>res.json())
    .then(result=>{
      console.log(result)
      setPic(result.posts)
      setUser(result.user)
     })
  },[])
  return (
    <div className='profile'>
      {/* Profile frame */}

      <div className="profile-frame">
        <div onClick={chnageProfile} className="profile-pic">
          <img src={user.Photo?user.Photo:profilePic} alt="" />
        </div>

        <div className="profile-data">
          <h1>{localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).name}</h1>
          <div className="profile-info">
            <p>{pic?pic.length:"0"} posts</p>
            <p>{user.followers?user.followers.length:"0"} followers</p>
            <p>{user.following?user.following.length:"0"}  following</p>
          </div>
        </div>
      </div>

      <hr style={{width:"90%",margin:"25px auto",opacity:"0.8"}}/>

      <div className="gallery">
        {
          pic.map((data)=>{
            return (
              <img key={data._id} src={data.photo}
                onClick={()=>toggleDetails(data)}
              ></img>
            )
          })
        }
      </div>
     
     {

      show && <PostDetail item={post} toggleDetails={toggleDetails}></PostDetail>
     }
     {
      changePic && <ProfilePic chnageProfile={chnageProfile}/>
     }
    </div>
  )
}

export default Profile