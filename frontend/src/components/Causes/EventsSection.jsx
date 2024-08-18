import React from 'react';
import styles from './EventsSection.module.css';

const EventsSection = ({events,cause,setCause,causeid}) => {

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const dd = String(today.getDate()).padStart(2, '0');
    
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    // console.log(formattedDate); // Outputs: yyyy-mm-dd
    const join=(eventId)=>{
        fetch(`http://localhost:5000/${eventId}/join`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                causeid:causeid
              }),
           
          })
            .then((res) => res.json())
            .then((result) => {
               
                    setCause(result)
                
            })
            .catch((error)=>{
                console.log(error)
        })

    }
    console.log(events)
    return (
        <div className={styles.eventsSection}>
            <div className={styles.eventCards}>
                {events && events.map(event => (
                    <div key={event.id} className={styles.eventCard}>
                        <div className={styles.eventCardImg}>
                        <img src={event.photo} alt={event.title} />
                        </div>
                        <div>
                            <h3>{event.eventName}</h3>
                            <p>{event.date}</p>
                            {formattedDate==event.date ||  event && event.users.includes(
                JSON.parse(localStorage.getItem("user"))._id)?<button style={{cursor:"not-allowed"}} disabled>Join</button>:<button onClick={()=>{join(event._id)}}>Join</button>}
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsSection;


// AIzaSyA2ozQwQ771-_55SFtt3PmH4BdKdSML8-g