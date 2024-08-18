import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

export const ChatContext = createContext(null);

const ChatContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const[selectedChat,setSelectedChat]=useState()
  const[chats,setChats]=useState([])
  const[notification,setNotification]=useState([]);

  useEffect(() => {
    
    const token = localStorage.getItem("jwt");
    if (!token) {
      return 
    }

    const userInfo = JSON.parse(localStorage.getItem("user"));
    setUser(userInfo);
      console.log(userInfo)
    if (!userInfo) {
      navigate("/signup");
    }
  }, [navigate]);

  const contextValue = {
    user,
    setUser,selectedChat,setSelectedChat,chats,setChats,
    notification,setNotification
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
