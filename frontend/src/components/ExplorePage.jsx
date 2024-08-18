// src/components/ExplorePage.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosShareAlt } from 'react-icons/io';
import CommentAddBox from './CommentAddBox';
import CommentCard from './CommentCard';
import Share from './Share';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const ExplorePage = () => {
  // const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const[show,setShow]=useState(false)

  const{likePost,unLikePost,data,makeComment,setData}=useContext(StoreContext)

  const [shareOpen, setShareOpen] = useState(false);
  const[postId,setPostId]=useState("")
 
  const toggleComment=(post)=>{
    if(show){
      setShow(false);
    }else{
      setShow(true)
      setItem(post)
    }
  }
  const[item,setItem]=useState([])

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return navigate("/signup");
    }
    fetchExplorePosts();
  }, []);

  const fetchExplorePosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/explore', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      if(response.data.posts){
        setData(response.data.posts);
      }else{
        setData(response.data);
      }
      
    } catch (error) {
      // console.error('Error fetching explore posts:', error);
      console.log(error)
    }
    
  };
  var profilePic="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"


  return (
    <div className="home">
    {data && data.map((post) => {
      return (
        <div className="card">
          <div className="card-header">
            <div className="card-pic">
              <img src={post.postedBy.Photo?post.postedBy.Photo:profilePic} alt="" />
            </div>
            <Link to={`/profile/${post.postedBy._id}`}>
            <h5>{post.postedBy.name}</h5>
            </Link>
            
          </div>
          <div className="card-image">
            <img src={post.photo} alt="" />
          </div>

          <div className="card-content">
            {
              post.likes.includes(
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
            <span onClick={()=>{setShareOpen(true)
              setPostId(post._id)
            }}><IoIosShareAlt size={25} style={{cursor:"pointer",marginLeft:"5px"}}  /></span>
            <p>{post.likes.length} Like</p>
            <p>{post.body}</p>
            <p>{post.comments.length} Comments</p>
            <p style={{fontWeight:"bold",cursor:"pointer"}} onClick={()=>toggleComment(post)}>View all comments</p>
          </div>


              
          <CommentAddBox  postId={post._id}/>
       
        </div>
      );
    })}

    {/* Show Comments */}

    {show && (
        <CommentCard toggleComment={toggleComment} item={item} makeComment={makeComment} />
    
    )}


{
        shareOpen && <Share setShareOpen={setShareOpen} id={postId}></Share>
      }
    
  </div>
);

};

export default ExplorePage;
