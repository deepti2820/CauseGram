import React from 'react'
import "./PostDetail.css"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function PostDetail({item,toggleDetails}) {

    const navigate=useNavigate()
    const removePost=(postId)=>{
        if(window.confirm("Do you really want to delete this post")){
            fetch(`http://localhost:5000/deletePost/${postId}`,{
                method:"delete",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
    
            })
            .then((res)=>res.json())
            .then((result)=>{
                toast.success(result.message)
                toggleDetails()
                navigate("/")
            })
        }
       
    }
  return (
   
    <div className="showComment">
    <div className="container">
      <div className="postPic">
        <img src={item.photo}  style={{width:"100%" ,height:"100%"}} alt="" />
      </div>
      <div className="details">
        {/* card header */}
        <div
          className="card-header"
          style={{ borderBottom: "1px solid #00000029" }}
        >
          <div className="card-pic">
            <img
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
              alt=""
            />
          </div>
          <h5>{item.postedBy.name}</h5>
          <div className="deletePost">
          <span className="material-symbols-outlined" onClick={()=>{removePost(item._id) ; }}>delete</span>
          </div>
        </div>

        {/* commentSection */}
        <div
          className="comment-section"
          style={{ borderBottom: "1px solid #00000029" }}
        >
          {item.comments.map((comment) => {
            return (
              <p className="comm">
                <span
                  className="commenter"
                  style={{ fontWeight: "bolder" }}
                >
                  {comment.postedBy.name}{" "}
                </span>
                <span className="commentText">{comment.comment}</span>
              </p>
            );
          })}
        </div>

        {/* card content */}
        <div className="card-content">
          <p>{item.likes.length} Likes</p>
          <p>{item.body}</p>
        </div>

        {/* add Comment */}
       
      </div>
    </div>
    <div
      className="close-comment"
      onClick={() => {
        toggleDetails();
      }}
    >
      <span className="material-symbols-outlined material-symbols-outlined-comment">
        close
      </span>
    </div>
  </div>
    
  )
}

export default PostDetail