import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import io from 'socket.io-client';

export const StoreContext=createContext(null);

const StoreContextProvider=(props)=>{

    const [data, setData] = useState([]);

 const[modalOpen,setModalOpen]= useState(false)

const url="https://causegrambackend-bju0.onrender.com"
const frontendUrl="https://causegramfrontend.onrender.com";

 const [userLogin,setUserLogin]=useState(false);

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
      setData((prevData) => {
        const newData = prevData.posts.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        return { ...prevData, posts: newData };
      });
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
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
      
      setData((prevData) => {
        const newData = prevData.posts.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        return { ...prevData, posts: newData };
      });
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
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
        setData((prevData) => {
          const newData = prevData.posts.map((posts) => {
            if (posts._id === result._id) {
              return result;
            } else {
              return posts;
            }
          });
          return { ...prevData, posts: newData };
        });
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
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
        url
    }
    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
