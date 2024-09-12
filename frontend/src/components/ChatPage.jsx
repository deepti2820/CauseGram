import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { ChatContext } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChat from '../components/miscellaneous/MyChat';
import ChatBox from '../components/miscellaneous/ChatBox';
import { useNavigate } from 'react-router-dom';
function ChatPage() {

  const {user}=useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);
    const navigate=useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      return navigate("/signup");
    }
})

  return (
    <>
   
    <div className='country-details-container'>
    <span className="back-button" onClick={() => history.back()}>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>
    </div>

    <div style={{ width: "100%" }}>
      
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
    </>
  )
}

export default ChatPage