import React, { useContext, useEffect, useState } from 'react';
import styles from './CauseGrid.module.css';
import CauseCard from './CauseCard';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const CauseGrid = () => {
    

    const [causes,setCauses]=useState();
    const {url}=useContext(StoreContext)

    useEffect(()=>{
        fetchCauses();
    },[])

    const fetchCauses=()=>{
        fetch(`${url}/causeProfile/allcauses`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          })
        .then((res) => res.json())
        .then((result) => setCauses(result))
        .catch((err) => console.log(err));
    }
    

    // console.log(causes)

    return (
        
        <div className={styles.gridContainer}>
            <h1 className={styles.header}>Explore Causes</h1>
            <div className={styles.grid}>
           
                {causes && causes.map((cause) => {
                    return (
                        <Link to={`/causeProfile/${cause._id}`}>

                             <CauseCard 
                        key={cause._id} 
                        name={cause.causeName} 
                        description={cause.description} 
                        image={cause.photo} 
                        // onClick={navigate(`/causeProfile/:${cause._id}`)}
                       
                    />
                    </Link>
                   
                    )
                })}
            </div>
        </div>
        
    );

}
export default CauseGrid;
