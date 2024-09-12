import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import io from 'socket.io-client';

export const StoreContext=createContext(null);

const StoreContextProvider=(props)=>{

    const [data, setData] = useState([]);

 const[modalOpen,setModalOpen]= useState(false)


 const [userLogin,setUserLogin]=useState(false);

 const url="https://causegrambackend-bju0.onrender.com"

const frontendUrl="http://localhost:5173";

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
        const newData = data.posts.map((posts) => {
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
        console.log(data)
        const newData = data.posts.map((posts) => {
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
        console.log(result);
        const newData = data.posts.map((posts) => {
          if (posts._id == result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        
        setComment(" ");
        toast.success("Comment added.")
        
      });
  };

  const [comment, setComment] = useState("");

    const contextValue={
        setModalOpen,
        setUserLogin,
        modalOpen,
        userLogin,
        setData,
        data,
        likePost,
        unLikePost,
        makeComment,
        comment,
        setComment,
        url,
        frontendUrl
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
