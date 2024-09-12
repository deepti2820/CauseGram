export const getSender=(loggedUser,users)=>{
  loggedUser=JSON.parse(localStorage.getItem("user"));
  console.log(loggedUser)
    return users[0]._id===loggedUser._id?users[1].name:users[0].name
}

export const getSenderFull=(loggedUser,users)=>{
    return users[0]._id===loggedUser._id?users[1]:users[0]
}


export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(m);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender[0]._id === m.sender[0]._id &&
      messages[i].sender[0]._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender[0]._id !== m.sender[0]._id &&
        messages[i].sender[0]._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender[0]._id !== userId)
    )
      return 0;
    else return "auto";
  };
  
  export const isSameSender = (messages, m, i, userId) => {
    // console.log(m.sender[0].name);

    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender[0]._id !== m.sender[0]._id ||
        messages[i + 1].sender[0]._id === undefined) &&
      messages[i].sender[0]._id !== userId
    );
  };
  
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender[0]._id !== userId &&
      messages[messages.length - 1].sender[0]._id
    );
  };
  
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender[0]._id === m.sender[0]._id;
  };
  