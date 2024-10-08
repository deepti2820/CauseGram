import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import axios from "axios";
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
// import ".";
import Lottie, {} from "react-lottie"
import io from "socket.io-client";
import animationData from "../animations/typing.json"
import ScrollableChat from './ScrollableChat';
import { StoreContext } from '../context/StoreContext';
const ENDPOINT="https://causegrambackend-bju0.onrender.com"
var socket,selectedChatCompare;

function SingleChat({fetchAgain,setFetchAgain}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const {url}=useContext(StoreContext)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

    const { selectedChat, setSelectedChat, user, notification, setNotification } =useContext(ChatContext);

    const fetchMessages = async () => {
      if (!selectedChat) return;
  
      try {

        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),

          },
        };
  
        setLoading(true);
  
        const { data } = await axios.get(
          `${url}/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false);
  
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    useEffect(()=>{

      fetchMessages();
      selectedChatCompare=selectedChat
    },[selectedChat])

    const sendMessage = async (event) => {
      if (event.key === "Enter" && newMessage) {
        socket.emit("stop typing", selectedChat._id);
        try {

          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),

            },
          };
          setNewMessage("");
          const { data } = await axios.post(
            `${url}/api/message`,
            {
              content: newMessage,
              chatId: selectedChat._id,
            },
            config
          );
          socket.emit("new message", data);
          setMessages([...messages, data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    };

  

    useEffect(() => {
      socket.on("message recieved", (newMessageRecieved) => {
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          // if (!notification.includes(newMessageRecieved)) {
          //   setNotification([newMessageRecieved, ...notification]);
          //   setFetchAgain(!fetchAgain);
          // }
          let containNot=false;
          for(let noti of notification){
            if(noti.chat._id==newMessageRecieved.chat._id){
              // console.log(noti)
              containNot=true;
              break;
            }
          }
          if(!containNot){
            if (!notification.includes(newMessageRecieved)) {
                setNotification([newMessageRecieved, ...notification]);
                setFetchAgain(!fetchAgain);
              }
          }
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
      });
    });
  

    console.log(notification)

    const typingHandler = (e) => {
      setNewMessage(e.target.value);
  
      if (!socketConnected) return;
  
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
          socket.emit("stop typing", selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
    };
    console.log(notification)
  return (
    <>
        {selectedChat ? (
        <>
           <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
             {/* {messages && */}
              {(!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModel
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))} 
          </Text>
         <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div style={{display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                scrollbarWidth: "none"}}>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
    
  )
}

export default SingleChat
