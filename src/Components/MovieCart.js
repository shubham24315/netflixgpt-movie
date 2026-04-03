import React from 'react'
import { Link } from 'react-router-dom'
import { IMG_CDN_URL } from '../utils/constants'

const MovieCart = ({ posterPath, title, variant = 'row', movieId }) => {
  if (!posterPath) return null

  const wrap =
    variant === 'grid'
      ? 'group w-full max-w-[220px] mx-auto'
      : 'group w-36 shrink-0 snap-start sm:w-40 md:w-44'

  const card = (
      <div className="overflow-hidden rounded-md shadow-card ring-1 ring-white/5 transition-all duration-300 ease-out-expo group-hover:z-10 group-hover:scale-[1.06] group-hover:shadow-card-hover group-hover:ring-white/20">
        <img
          src={IMG_CDN_URL + posterPath}
          alt={title ? `${title} poster` : 'Movie poster'}
          loading="lazy"
          decoding="async"
          className="aspect-[2/3] w-full object-cover transition-transform duration-500 ease-out-expo group-hover:scale-105"
        />
      </div>
  )

  if (movieId != null) {
    return (
    <Link
      to={`/Browse/movie/${movieId}`}
      className={`${wrap} block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
      aria-label={title ? `View details: ${title}` : 'View movie details'}
    >
      {card}
    </Link>
    )
  }

  return (
    <div className={wrap}>
      {card}
    </div>
  )
}

export default MovieCart