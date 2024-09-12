import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";
function MyFollowingPost() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");

  const[show,setShow]=useState(false)

  const[item,setItem]=useState([])
  const {url}=useContext(StoreContext)

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return navigate("/signup");
    }

    fetch(`${url}/myfollowingpost`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setData(result.posts)})
      .catch((err) => console.log(err));
  }, []);

  const toggleComment=(post)=>{
    if(show){
      setShow(false);
    }else{
      setShow(true)
      setItem(post)
    }
  }


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
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
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
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

//   console.log(data)

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
        const newData = data.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
        setComment(" ");
        toast.success("Comment added.")
      });
  };

  // console.log(item)

  return (
    <div className="home">
      {data && data.map((post) => {
        return (
          <div className="card">
            <div className="card-header">
              <div className="card-pic">
                <img src={post.photo} alt="" />
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
              <p>{post.likes.length} Like</p>
              <p>{post.body}</p>
              <p style={{fontWeight:"bold",cursor:"pointer"}} onClick={()=>toggleComment(post)}>View all comments</p>
            </div>

            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={() => makeComment(comment, post._id)}
                className="comment"
              >
                Post
              </button>
            </div>
          </div>
        );
      })}

      {/* Show Comments */}

      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
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
              </div>

              {/* commentSection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.length>0?item.comments.map((comment) => {
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
                }):"No comments Yet"}
              </div>

              {/* card content */}
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );

}

export default MyFollowingPost;
