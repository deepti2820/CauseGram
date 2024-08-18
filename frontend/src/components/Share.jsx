import React, { useContext } from 'react'
import {RiCloseLine} from "react-icons/ri"
import "./Model.css"
import { useNavigate } from 'react-router-dom'
import { FaWhatsapp } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";


function Share({setShareOpen,id}) {
    const navigate=useNavigate();
     //whatsapp sharing
  const handleShareWhatsapp = () => {
    const message = "Check out this awesome website!";
    const url = `http://localhost:5173/post/${id}`;
   
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
    setShareOpen(false)
};

// const handleShareSms = () => {
//   const phoneNumber = '9509966586'; // Optionally pre-fill a phone number
//   const message = "Check out this awesome website!";
//   const url = "https://www.hotstar.com/in/home"; // Replace with your actual URL
//   const smsUrl = `sms:${phoneNumber}?&body=${encodeURIComponent(message + ' ' + url)}`;
//   window.open(smsUrl, '_blank');
// }; 

const handleShareFacebook = () => {
  const url = "https://example.com"; // Replace with your actual URL
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank');
  setShareOpen(false)
};
  return (
    <div className="darkBg">
        <div className="centered">
        <div className='modal'>
        <div className="modalHeader">
            <h5 className='heading'>Share post</h5>
        </div>

        <button className='closeBtn' onClick={()=>setShareOpen(false)}>
            <RiCloseLine ></RiCloseLine>
        </button>

        <hr />
        <div className="modalActions">
            <div className="actionsContainer">
                <button style={{backgroundColor:"	#25D366"}} className="logOutBtn" onClick={()=>{handleShareWhatsapp()}}>
                     <FaWhatsapp size={30} />
                </button>
                <button className="cancelBtn" style={{backgroundColor:"#1877F2"}}  onClick={()=>{handleShareFacebook()}}><FaFacebook size={30} />
                </button>
            </div>
        </div>
    </div>
    </div>
    
    </div>
    
  )
}

export default Share