import React from 'react'

const VideoTitle = ({title,overview}) => {
  return (
    <div className="w-screen aspect-video pt-[12%] px-24 absolute text-white bg-gradient-to-r from-black" >
       <h1 className="text-6xl font-bold ">{title}</h1>
       <p className="py-6 text-lg w-1/4">{overview}</p> 
       <div className="">
         <button className="bg-white text-black p-4  px-12 text-center text-lg rounded-md hover:bg-opacity-50">▶️Play</button>
         <button className="bg-white  text-black p-4  px-12 text-center text-lg  rounded-md mx-2 hover:bg-opacity-50">🛈 More info</button>
       </div>
    </div>
  )
}

export default VideoTitle
