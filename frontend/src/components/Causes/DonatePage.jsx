import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

function DonatePage() {

    const [amount,setAmount]=useState("");
    const{causeid}=useParams();
    const navigate=useNavigate()
    const{url}=useContext(StoreContext)

    const donate=()=>{
        fetch(`${url}/causeProfile/donate/${causeid}`,{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                amount:amount
            })
        }).then(res=>res.json())
        .then(data=>{
            setAmount("")
            if(data.success){
                toast.success(data.message);
                navigate(`/causeProfile/${causeid}`);
            }else{
                toast.error(data.message)
            }
        })
        .catch(err=>console.log(err))

    }


  return (
    <div style={{width:"50%", margin:"40px 25%", display:"flex", gap:"5px"}}>
                        <input type="text" value={amount} placeholder='Enter the amount you want to donate' onChange={(e)=>{setAmount(e.target.value)}} />

       <button style={{ backgroundColor: "#f44336",
    color: "white",
    marginRight: "10px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px"}}  onClick={donate}>Donate</button>
    </div>
  )
}

export default DonatePage