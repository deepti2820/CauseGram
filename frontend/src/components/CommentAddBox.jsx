import React, { useState } from 'react'
import { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'

function CommentAddBox({postId}) {

  const [comment, setComment] = useState("");
  const{makeComment}=useContext(StoreContext)
  return (
    <>
        <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                onClick={() => {makeComment(comment, postId,"comment")
                  setComment("")
                }}
                className="comment"
              >
                Post
              </button>
            </div>
    </>
  )
}

export default CommentAddBox