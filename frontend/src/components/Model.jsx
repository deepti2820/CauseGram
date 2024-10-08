import React from 'react'
import {RiCloseLine} from "react-icons/ri"
import "./Model.css"
import { useNavigate } from 'react-router-dom'


function Model({setModalOpen}) {
    const navigate=useNavigate();
  return (
    <div className="darkBg" onClick={()=>setModalOpen(false)}>
        <div className="centered">
        <div className='modal'>
        <div className="modalHeader">
            <h5 className='heading'>Confirm</h5>
        </div>

        <button className='closeBtn' onClick={()=>setModalOpen(false)}>
            <RiCloseLine></RiCloseLine>
        </button>

        <div className="modalContent">
            Are you really want to logout ?
        </div>

        <div className="modalActions">
            <div className="actionsContainer">
                <button className="logOutBtn" onClick={()=>{setModalOpen(false);
                    localStorage.removeItem("jwt");
                    navigate("/signin")
                }}>
                    Log Out
                </button>
                <button className="cancelBtn" onClick={()=>setModalOpen(false)}>Cancle</button>
            </div>
        </div>
    </div>
    </div>
    
    </div>
    
  )
}

export default Model