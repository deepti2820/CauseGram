import React, { useContext } from 'react';
import styles from './FollowDonateButtons.module.css';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const FollowDonateButtons = ({admin,causeid,setCause,cause,events}) => {


    const {url}=useContext(StoreContext)
    const followCauseProfile=(causeid)=>{
        fetch(`${url}/causeProfile/${causeid}/follow`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            
          })
            .then((res) => res.json())
            .then((result) => {
                if(result._id===causeid){
                    setCause(result);
                }else{
                    setCause(cause)
                }
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    const unfollowCauseProfile=(causeid)=>{
        fetch(`${url}/causeProfile/${causeid}/unfollow`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            
          })
            .then((res) => res.json())
            .then((result) => {
               setCause(result)
            })
            .catch((error)=>{
                console.log(error)
            })
    }
    
   
    return (
        <div className={styles.buttonsContainer}>
            {
              cause && !cause.users.includes(
                JSON.parse(localStorage.getItem("user"))._id)?
            (<button className={styles.followButton} onClick={()=>{followCauseProfile(causeid)}}>
                
                Follow</button>):
                 <button className={styles.followButton} onClick={()=>{unfollowCauseProfile(causeid)}}>
                
                 Unfollow</button>}
                 <Link to={`/causeProfile/donate/${causeid}`}> <button className={styles.donateButton}>Donate</button></Link>
           
            {admin &&      <Link to={`/${causeid}/addEvent`}>     <button className={styles.eventButton}>Add Event</button></Link>  
        }
        <Link to={`/exploreLocalCauses`}> <button className={styles.followButton}>Explore Local Causes</button></Link>
        </div>
    );
};

export default FollowDonateButtons;
