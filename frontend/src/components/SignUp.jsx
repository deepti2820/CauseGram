import React, { useEffect, useState,useContext } from "react";
import logo from "../img/logo.png";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { StoreContext } from "../context/StoreContext";


function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {setUserLogin}=useContext(StoreContext)


  const emailRgex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const passwordRegx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const postData = () => {
    if (!email || !password || !username || !name) {
      return toast.error("Enter all fields");
    }

    //checking Email
    if (!emailRgex.test(email)) {
      return toast.error("Not a valid email");
    } else if (!passwordRegx.test(password)) {
      return toast.error(
        "Password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
      );
    }

    //sending data to server
    fetch("http://localhost:5000/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          navigate("/signin");
        } else {
          toast.error(data.message);
        }
        console.log(data);
      });
  };

  const continueWithGoogle=(credentialResponse)=>{
    const jwtDetails=jwtDecode(credentialResponse.credential)
    console.log(jwtDetails)
    fetch("http://localhost:5000/googleLogin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nameP: jwtDetails.name,
          emailP: jwtDetails.email,
          userName: jwtDetails.given_name,
          email_verified:jwtDetails.email_verified,
          clientId:credentialResponse.clientId,
          Photo:jwtDetails.picture
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            toast.success(data.message);
            localStorage.setItem("jwt",data.token)
            localStorage.setItem("user",JSON.stringify(data.user))
            setUserLogin(true)
            console.log("dhd")
            navigate("/")
          } else {
            toast.error(data.message);
          }
          console.log(data);
        });
  }


  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <img className="signUpLogo" src={logo} alt="" />
          <p className="loginPara">
            Sign up to see photos and videos <br /> from your friends
          </p>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              placeholder="Full Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              value={username}
              id="username"
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={password}
              id="password"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "14px", margin: "3px 0px" }}
          >
            By signing up, you agree to out Terms, <br /> privacy policy and
            cookies policy.
          </p>
          <input
            type="submit"
            id="submit-btn"
            value="Sign Up"
            onClick={() => {
              postData();
            }}
          />

          <hr></hr>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
                continueWithGoogle(credentialResponse)
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
          
        </div>

        <div className="form2">
          Already have an account ?
          <Link to="/signin">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
