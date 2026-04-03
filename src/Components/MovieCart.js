import React from 'react'
import { IMG_CDN_URL } from '../utils/constants'

const MovieCart = ({ posterPath, title }) => {
  if (!posterPath) return null

  return (
    <div className="group w-36 shrink-0 snap-start sm:w-40 md:w-44">
      <div className="overflow-hidden rounded-md shadow-card ring-1 ring-white/5 transition-all duration-300 ease-out-expo group-hover:z-10 group-hover:scale-[1.06] group-hover:shadow-card-hover group-hover:ring-white/20">
        <img
          src={IMG_CDN_URL + posterPath}
          alt={title ? `${title} poster` : 'Movie poster'}
          loading="lazy"
          decoding="async"
          className="aspect-[2/3] w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
        />
      </div>
    </div>
  )
}

export default MovieCart