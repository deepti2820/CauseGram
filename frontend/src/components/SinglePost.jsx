

import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { StoreContext } from '../context/StoreContext';

function SinglePost() {
    const [post, setPost] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const[comment,setComment]=useState("")
    const {url}=useContext(StoreContext)
    const profilePic = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/signup");
            return;
        }
        fetchPost();
    }, [navigate]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`${url}/post/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("jwt"),
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Fetched post:', result); // Log the result to see its structure
            setPost(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    
  const likePost = (id) => {
    fetch(`${url}/like`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setPost(result)
      });
  };

  const unLikePost = (id) => {
    fetch(`${url}/unlike`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setPost(result)
      });
  };

  // console.log(data)

  //functio to make comment

  const makeComment = (text, id) => {
    if(!text){
      return toast.error("Add Comment")
    }
    fetch(`${url}/comment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setPost(result)
        setComment("");
        toast.success("Comment added.")
      });
  };


    return (
        <div>
            {post && (
                 <div className="card">
                 <div className="card-header">
                   <div className="card-pic">
                    <img src={post.postedBy && post.postedBy.Photo} alt="User" />
                   </div>
                   <Link to={`/profile/${post.postedBy && post.postedBy._id}`}>
                   <h5>{post.postedBy && post.postedBy.name}</h5>
                   </Link>
                   
                 </div>
                 <div className="card-image">
                   <img src={post.photo || profilePic} alt="" />
                 </div>
                
                 <div className="card-content">
                        {
                         post.likes && post.likes.includes(
                            JSON.parse(localStorage.getItem("user"))._id
                          ) ? (
                            <span
                              className="material-symbols-outlined material-symbols-outlined-red"
                              onClick={() => {
                                unLikePost(post._id);
                              }}
                            >
                              favorite
                            </span>
          
                            
                          ) : (
                            <span
                              className="material-symbols-outlined"
                              onClick={() => {
                                likePost(post._id);
                              }}
                            >
                              favorite
                            </span>
                          )
                          // JSON.parse(localStorage.getItem("user"))._id
                        }
                       
                        <p>{post.likes?post.likes.length:"0"} Like</p>
                        <p>{post.body}</p>
                        <p>{post.comments?post.comments.length:"0"} Comments</p>
                      </div>

                      {/* <CommentAddBox postId={post._id}/> */}

               <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={() => {makeComment(comment, post._id)
                  setComment("")
                }}
                className="comment"
              >
                Post
              </button>
            </div>

                     
                    </div>

     

            )}
        </div>
    );
}

export default SinglePost;
