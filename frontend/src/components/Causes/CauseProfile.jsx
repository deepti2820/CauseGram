import React, { useEffect, useState } from 'react';
import styles from './CauseProfile.module.css';
import FollowDonateButtons from './FollowDonateButtons';
import AboutSection from './AboutSection';
import EventsSection from './EventsSection';
import ImpactSection from './ImpactSection';
import UpdatesSection from './UpdatesSection';
import { useParams } from 'react-router-dom';




const CauseProfile = () => {

    const {causeid}=useParams()
    const[cause,setCause]=useState()
    const[user,setUser]=useState();

  useEffect(()=>{
    const token = localStorage.getItem("jwt");
    if (!token) {
      return navigate("/signup");
    }

    setUser( JSON.parse(localStorage.getItem("user")))
    fetch(`http://localhost:5000/causeProfile/${causeid}`,{
      headers: {
        "Authorization":"Bearer "+localStorage.getItem("jwt")
      },
    })
    .then(res=>res.json())
    .then(result=>{
        // console.log(result)
        setCause(result)
     })
  },[])

//   if(user && cause){
//     if(cause.admin===user._id){
//         console.log("true")
//     }else{
//         console.log(cause.admin)
//     }
//   }

const [activeTab, setActiveTab] = useState('events');

    const renderContent = () => {
        if (activeTab === 'events') {
            return (
                <div className={styles.content}>
                    <EventsSection events={cause &&cause.events} cause={cause && cause} causeid={cause && cause._id} setCause={setCause}/>
                </div>
            );
        } else if (activeTab === 'updates') {
            return (
                <div className={styles.content}>
                   <UpdatesSection/>
                </div>
            );
        }
    };

    console.log((cause && cause))

    return (
        <div className={styles.causeProfile}>
            <div className={styles.banner}>
                
                <h1>{cause && cause.causeName}</h1>
            </div>
            <div className={styles.profileImage}>
                <img src={cause && cause.photo} alt="Cause Logo" />
            </div>
            <FollowDonateButtons admin={cause && cause.admin===user._id} causeid={cause && cause._id} cause={cause && cause} setCause={setCause} events={cause &&cause.events}/>
            <AboutSection desc={cause && cause.description}/>
            <ImpactSection donation={cause && cause.donations} participatent={cause && cause.users.length} />
            {/* <EventsSection />
            
            <UpdatesSection /> */}

<div className={styles.tabsContainer}>
            <div className={styles.tabs}>
                <button 
                    className={`${styles.tab} ${activeTab === 'events' ? styles.active : ''}`} 
                    onClick={() => setActiveTab('events')}
                >
                    Events
                </button>
                <button 
                    className={`${styles.tab} ${activeTab === 'updates' ? styles.active : ''}`} 
                    onClick={() => setActiveTab('updates')}
                >
                    Updates
                </button>
            </div>
            {renderContent()}
        </div>
        </div>
    );
};

export default CauseProfile;
