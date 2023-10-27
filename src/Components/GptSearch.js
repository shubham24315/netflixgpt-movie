import React from 'react'
import GptSearchBar from './GptSearchBar'
import GptMovieSuggesions from './GptMovieSuggesions'
import { BG_URL } from '../utils/constants'
const GptSearch = () => {
  return (
    <div>
        <div className=" -z-10 fixed">
        <img src={BG_URL} alt="" />
        </div>
    <GptSearchBar/>
    <GptMovieSuggesions/>
    </div>
  )
}

export default GptSearch