import React from 'react'
import GptSearchBar from './GptSearchBar'
import GptMovieSuggesions from './GptMovieSuggesions'
import { BG_URL } from '../utils/constants'

const GptSearch = () => {
  return (
    <div className="relative min-h-screen pb-12 pt-[4.25rem] sm:pt-[4.5rem]">
        <div className="fixed inset-0 -z-10">
        <img
          src={BG_URL}
          alt=""
          className="h-full w-full object-cover object-center brightness-[0.25]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" aria-hidden />
        </div>
    <GptSearchBar/>
    <GptMovieSuggesions/>
    </div>
  )
}

export default GptSearch