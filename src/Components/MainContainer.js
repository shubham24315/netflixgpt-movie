import React from 'react'

import { useSelector } from 'react-redux'
import VideoTitle from './VideoTitle'
import VideoBackground from './VideoBackground'

const MainContainer = () => {
    const movies = useSelector((state) => state.movies?.nowPlayingMovies)

    if (movies === null) {
      return (
        <div className="relative w-full pt-20">
          <div className="aspect-video w-full animate-pulse bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
          <div className="absolute bottom-20 left-6 right-6 space-y-4 sm:left-12 md:left-24">
            <div className="h-10 max-w-md rounded-lg bg-white/10 sm:h-14" />
            <div className="h-4 max-w-xl rounded bg-white/5" />
            <div className="h-4 max-w-lg rounded bg-white/5" />
          </div>
        </div>
      )
    }

    const mainMovie = movies[0]
    const { original_title, overview, id, backdrop_path } = mainMovie

  return (
    <div className="relative pt-16 sm:pt-20">
      <VideoTitle title={original_title} overview={overview} />
      <VideoBackground movieId={id} backdropPath={backdrop_path} />
    </div>
  )
}

export default MainContainer