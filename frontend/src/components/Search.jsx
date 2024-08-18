import React, { useEffect, useState } from 'react'
import "./Search.css"
import SearchList from './SearchList';
import { useNavigate } from 'react-router-dom';
function Search() {

    const [query,setQuery]=useState(null);
    const [users,setUsers]=useState("");
    var profilePic="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    const navigate=useNavigate()

    useEffect(()=>{

        const token = localStorage.getItem("jwt");
        if (!token) {
          return navigate("/signup");
        }

        fetch("http://localhost:5000/search",{
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
        .then(res=>res.json())
        .then(result=>{
            setUsers(result.users)
        }).catch(err=>{
            console.log(err)
        })
    },[])

  console.log(users)
  return (
    <>
  
    <div className="search-container">
        
    <input onChange={((e)=>setQuery(e.target.value.toLowerCase()))} type="text" placeholder="Search"/>
  </div>
  <div>
  { query && users.filter((user)=>user.name.toLowerCase().includes(query)).map((user)=>{
                return   (
                   <>
                        <SearchList
                            key={user.username}
                            name={user.name}
                            photo={user.Photo?user.Photo:profilePic}
                            id={user._id}
                        />
                   </>              
                )
         
             })
          }
  </div>
  </>
  )
}

export default Search