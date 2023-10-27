import React from 'react'
import MovieList from './MovieList'
import { useSelector } from 'react-redux'

const SecondaryContainer = () => {
    const movies=useSelector(state=>state.movies)
  return movies && (
    <div className="-mt-52 relative z-20 bg-black" >

        {/* 
        MovieList- Popular
        MovieList- Now playing
        MovieList-Trending
        MOvieList - Horror
        */}
        <div className="-mt-52 relative z-20 pl-12">
        <MovieList title={"Now Playing"} movies={movies?.nowPlayingMovies}/>
        <MovieList title={"Trending"} movies={movies?.trendingMovies}/>
        <MovieList title={"Popular"} movies={movies?.popularMovies}/>
        <MovieList title={"Upcoming movies"} movies={movies?.upcomingMovies}/>
   
        </div>
    </div>
  )
}

export default SecondaryContainer