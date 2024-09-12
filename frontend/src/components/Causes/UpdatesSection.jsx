import React, { useContext, useEffect, useState } from 'react';
import styles from './UpdatesSection.module.css';
import { StoreContext } from '../../context/StoreContext';

const UpdatesSection = ({causeid}) => {
   const[updates,setUpdates]=useState();
   const {url}=useContext(StoreContext)
    useEffect(()=>{
        
    fetch(`${url}/causeProfile/update/${causeid}`,{
        headers: {
          "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
      })
      .then(res=>res.json())
      .then(result=>{
          // console.log(result)
          setUpdates(result)
       })
       .catch((error)=>{
            console.log(error)
       })

    },[])
    console.log(updates)
    return (
        <div className={styles.updatesSection}>
            <div className={styles.updateFeed}>
                {updates && updates.map(update => (
                    <div key={update._id} className={styles.update}>
                        <img src={update.photo} alt={update.text} />
                        <p>We have successfully completed {update.eventName}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdatesSection;
