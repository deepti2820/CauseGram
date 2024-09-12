import React, { useContext, useEffect } from 'react'
import Navabar from './components/Navabar'
import { Routes,Route, useLocation } from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'
import Profile from './components/Profile'
import {useState} from "react"
import { LoginContext } from '../context/LoginContext'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./App.css"
import Post from './components/Post'
import Model from './components/Model'
import UserProfile from './components/UserProfile'
import MyFollowingPost from './components/MyFollowingPost'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Search from './components/Search'
import Share from './components/Share'
import SinglePost from './components/SinglePost'
import ExplorePage from './components/ExplorePage'
import { StoreContext } from './context/StoreContext'
import ChatPage from './components/ChatPage'
import './App.css';
import CauseProfile from './components/Causes/CauseProfile'
import CauseCard from './components/Causes/CauseCard'
import CauseGrid from './components/Causes/CauseGrid'
import CreateCause from './components/Causes/CreateCause'
import CreateEvent from './components/Causes/CreateEvent'
import DonatePage from './components/Causes/DonatePage'
import MapComponent from './components/Causes/MapComponent'


function App() {

  // useEffect(()=>{
  //   setPost(JSON.stringify(post))
  // },[])

  const {modalOpen,setModalOpen,userLogin}=useContext(StoreContext)
  const location = useLocation();

  return (
    <div className='App'>
      <GoogleOAuthProvider clientId="568923091879-k2mcennk635f36q3dooikne4077onskd.apps.googleusercontent.com">

      <ToastContainer/>
      {location.pathname !== '/chats' && <Navabar login={userLogin} />}
      <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/signin" element={<SignIn/>}></Route>
          <Route exact path="/profile" element={<Profile/>}></Route>
          <Route path="/createPost" element={<Post/>}></Route>
          <Route path="/profile/:userid" element={<UserProfile/>}></Route>
          <Route path="/followingpost" element={<MyFollowingPost/>}></Route>
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/post/:id" element={<SinglePost />}></Route>
          <Route path="/explore" element={<ExplorePage/>} />
          <Route path="/chats" element={<ChatPage/>}/>
          <Route exact path="/causeProfile" element={<CauseGrid/>}/>
          <Route path="/causeProfile/:causeid" element={<CauseProfile/>}/>
          <Route path="/createCause" element={<CreateCause/>}/>
          <Route path="/:causeid/addEvent" element={<CreateEvent/>}/>
          <Route path="causeProfile/donate/:causeid" element={<DonatePage/>}/>

      </Routes>
      {
        modalOpen && <Model setModalOpen={setModalOpen}></Model>
      }
     
      </GoogleOAuthProvider>
    </div>
  )
}

export default App
