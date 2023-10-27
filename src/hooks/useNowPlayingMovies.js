import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNowPlayingMovies } from '../utils/movieSlice'
import { API_OPTIONS } from '../utils/constants'

const useNowPlayingMovies = () => {
    const dispatch=useDispatch();

    const nowPlayingMovies=useSelector(store=>store.movies.nowPlayingMovies);
    useEffect(() => {
      const getNowPlayingMovies = async () => {
        const data =await fetch('https://api.themoviedb.org/3/movie/now_playing?page=2', API_OPTIONS)
          const json=await data.json();
          // console.log(json,"now_playing");
          dispatch(addNowPlayingMovies(json.results))
       }
     if(!nowPlayingMovies){
      getNowPlayingMovies();//save our network calls we are doing memorization if data is already present
     }

    }, [])
}

export default useNowPlayingMovies;