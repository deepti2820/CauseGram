import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
// import {} from "react-no"
import axios from "axios"
import { HiMagnifyingGlass } from "react-icons/hi2";

// import 'bootstrap/dist/css/bootstrap.css';
import "../style.css"
import React, { useContext, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatContext } from "../../context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user,setSelectedChat ,chats,setChats,notification,setNotification} = useContext(ChatContext);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const logoutHandler = () => {
  //   localStorage.removeItem("chatUser");
  //   navigate("/signup");
  // };

  const toast=useToast()
  const handleSearch=async ()=>{
    if(!search){
      toast({
        title:"Please Enter something in search",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left"
      });
      return;
    }

    try{
      setLoading(true);

      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      };

      const {data}=await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
      console.log(data)
      setLoading(false);
      setSearchResult(data)
    }catch(error){
      console.log(error)
      toast({
        title:"Error Occurred",
        description:"Failed to load the result",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      });
    }
  }

  const accessChat=async (userId)=>{
    try{
      setLoadingChat(true)
      const chatUser = JSON.parse(localStorage.getItem('chatUser'));
      const config = {
        headers: {
          "Content-type":"application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      };

      const {data}=await axios.post(`http://localhost:5000/api/chat`,{userId},config);
      // console.log(data)
      if(chats && chats.find((c)=>c._id===data._id)){
        setChats([data,...chats])
      }
      setLoadingChat(false);
      setSelectedChat(data)
      onClose()
    }catch(error){
      console.log(error)
      toast({
        title:"Error fetching the chats",
        description:error.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      });
    }
  }
  // console.log(user)
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <HiMagnifyingGlass fontSize={20}/>

            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Start Messaging
        </Text>

        <div>
          <Menu>
            <MenuButton p={4}>
            {notification.length > 0 && (
         <div className="notification-badge">
              <span className="badge">    
                  {notification.length}
              </span>
          </div>
          )}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>

              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.Photo}
              />
            </MenuButton>

            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>

              {/* <MenuDivider /> */}
              {/* <MenuItem onClick={logoutHandler}>Logout</MenuItem> */}
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
              onClick={handleSearch}
              >
                Go
              </Button>
            </Box>

            {loading ? (
                <ChatLoading/>
            ):(
              
              searchResult?.map(user=>(
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={()=>accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
