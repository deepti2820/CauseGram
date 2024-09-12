import React, { useContext } from 'react'
import logo from "../img/logo.png"
import styles from "./Navbar.module.css"
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'
import { MdMessage,MdTravelExplore } from "react-icons/md";

function Navabar({userLogin}) {

  const navigate=useNavigate()

  const {setModalOpen}=useContext(StoreContext)
  const loginStatus=()=>{
    const token=localStorage.getItem("jwt")
    if(token || userLogin){
      return <>
      <Link to="/explore"><li>Explore</li></Link>
        <Link to="/search"><li>Search</li></Link>
        <Link to="/followingpost"><li>Following Post</li></Link>
        <Link to="/profile"><li>Profile</li></Link>
        <Link to="/createPost"><li>Create Post</li></Link>
        <Link to="/chats"><div >
        <MdMessage fontSize={20} />
        <div className={styles.notificationBbadge} >
              <span className={styles.badge}>    
                  {6}
              </span>
          </div>
        </div>
      </Link>
        
        <Link to={""}> <button className={styles.primaryBtn} onClick={()=>setModalOpen(true)}>Logout</button></Link>
      </>
    }else{
      <>
         <Link to="/signup"> <li>SignUp</li> </Link>
         <Link to="/signin"> <li>SignIn</li></Link>
      </>
    }
  }

  const loginStatusMobile=()=>{
    const token=localStorage.getItem("jwt")
    if(token || userLogin){
      return <>
        <Link to="/"><li><span className="material-symbols-outlined">home</span></li></Link>
        <Link to="/explore"><li><MdTravelExplore />        </li></Link>
        <Link to="/search"><span className="material-symbols-outlined">person_search</span></Link>
        <Link to="/followingpost"><li><span className="material-symbols-outlined">explore</span></li></Link>
        <Link to="/profile"><li><span className="material-symbols-outlined">account_circle</span></li></Link>
        <Link to="/createPost"><li><span class="material-symbols-outlined">add_box</span></li></Link>
        <Link to="/chats"><div >
        <MdMessage fontSize={20} />
        {/* <div className={styles.notificationBadge} >
              <span className={styles.badge}>    
                  {6}
              </span>
          </div> */}
        </div>
      </Link>
        
        <Link to={""}> <li  onClick={()=>setModalOpen(true)}><span className="material-symbols-outlined">logout</span></li></Link>
      </>
    }else{
      <>
         <Link to="/signup"> <li>SignUp</li> </Link>
         <Link to="/signin"> <li>SignIn</li></Link>
      </>
    }
  }
  return (
    <div className={styles.navbar}>
        <img id={styles.instalogo} src={logo} onClick={()=>navigate("/")}  alt=""/>

        <ul className={styles.navMenu}>
          {
            loginStatus()
          }
        </ul>

        <ul className={styles.navMobile}>
          {
            loginStatusMobile()
          }
        </ul>
    </div>
  )
}

export default Navabar