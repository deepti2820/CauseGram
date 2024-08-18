import React from 'react'
import "./Search.css"
import { Link } from 'react-router-dom'

function SearchList({name,photo,id}) {
  return (
    <div className="search">
    <Link to={`/profile/${id}`}>
    <div className="flex-item">
        <img src={photo} alt="Description of the image 1" />
        <p>{name}</p>
    </div>
    </Link>
    </div>
  )
}

export default SearchList