import React from 'react'
import { IMG_CDN_URL } from '../utils/constants'

const MovieCart = ({posterPath}) => {
  if(!posterPath) return;
  return (IMG_CDN_URL+posterPath) && (
    <div className="w-48 px-4">
    <img src={IMG_CDN_URL+posterPath} alt="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReMIqotUQOoGeULle2zxKVFW34wdrcuZd9Zg&usqp=CAU" 
     />
    </div>
  )
}

export default MovieCart