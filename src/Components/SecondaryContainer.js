import React from 'react'
import MovieList from './MovieList'
import { useSelector } from 'react-redux'

const SecondaryContainer = () => {
  const movies = useSelector((state) => state.movies)
  if (!movies) return null

  return (
    <div className="relative z-20 -mt-24 bg-gradient-to-b from-transparent via-black/95 to-black pb-16 pt-8 sm:-mt-32 sm:pt-12 md:-mt-40 md:pt-16">
        <div className="mx-auto max-w-[1920px] px-4 sm:px-8 md:px-12">
        <MovieList title="Now Playing" movies={movies?.nowPlayingMovies} />
        <MovieList title="Trending" movies={movies?.trendingMovies} />
        <MovieList title="Popular" movies={movies?.popularMovies} />
        <MovieList title="Upcoming" movies={movies?.upcomingMovies} />
        </div>
    </div>
  )
}

export default SecondaryContainer