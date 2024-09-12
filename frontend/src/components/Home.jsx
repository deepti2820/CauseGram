import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosShareAlt } from "react-icons/io";
import Share from "./Share";
import CommentCard from "./CommentCard";
import CommentAddBox from "./CommentAddBox";
import { StoreContext } from "../context/StoreContext";

function Home() {
  const navigate = useNavigate();
 

  const[show,setShow]=useState(false)

  let limit=5;
  let skip=0;

  var profilePic="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"


  const[item,setItem]=useState([])
  const{likePost,unLikePost,data,makeComment,setData}=useContext(StoreContext)


  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return navigate("/signup");
    }



    fetchPost()
    window.addEventListener("scroll",handleScroll)
    
 
    

  }, []);

  const fetchPost=()=>{
    
    fetch(`http://localhost:5000/allposts?limit=${limit}&skip=${skip}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err));
  }

  const handleScroll=()=>{
    if(document.documentElement.clientHeight+window.pageYOffset>=document.documentElement.scrollHeight){

      // skip=skip+5;
      limit=limit+5;
      fetchPost()
    }
  }
  const toggleComment=(post)=>{
    if(show){
      setShow(false);
    }else{
      setShow(true)
      setItem(post)
    }
  }

  // console.log(data)

  // console.log(data)

  const [shareOpen, setShareOpen] = useState(false);
  const[postId,setPostId]=useState("")
 
console.log(data)
  return (
    <div className="home">
      {data.posts && data.posts.map((post) => {
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

}

export default Home;
