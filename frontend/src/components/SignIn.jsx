import React, { useState,useContext, useEffect, } from 'react'

import "./SignIn.css"
import logo from "../img/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../context/StoreContext'

function SignIn() {
    console.log("hello")
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate()
    const {setUserLogin}=useContext(StoreContext)

    const emailRgex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    const postData=async ()=>{
        if(!email || !password){
            return toast.error("Enter all fields")
        }

        //checking Email
            if(!emailRgex.test(email)){
                return toast.error("Not a valid email")
            }
        const response=await axios.post("http://localhost:5000/signin",{email:email,password:password})
        if(response.data.success){
            setEmail("");
            setPassword("")
            toast.success(response.data.message)
            localStorage.setItem("jwt",response.data.token)
            localStorage.setItem("user",JSON.stringify(response.data.user))
            setUserLogin(true)
            navigate("/")
        }else{
            toast.error(response.data.message);
        }
    }
  
  return (
    <div className='signIn'>
        <div>
            <div className="loginForm">
                <img className='signUpLogo' src={logo} alt="" />

                <div>
                    <input type="email" name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}  id="email" placeholder='Email'/>
                </div>

                <div>
                    <input type="password" name="password" id="password" value={password}  onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password' />
                </div>

                <input type="submit" onClick={postData} value='Sign In' id="login-btn" />
            </div>

            <div className="loginForm2">
                Don't have an account ?
                <Link to="/signup">
                    <span style={{color:"blue", cursor:"pointer"}}>Sign Up</span>
                </Link>
                
            </div>
        </div>
    </div>
  )
}

export default SignIn