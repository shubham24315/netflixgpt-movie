import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { API_OPTIONS } from '../utils/constants'
import { useSelector } from 'react-redux'
import { addTrendingMovies } from '../utils/movieSlice'
 const useTrendingMovies = () => {
    const dispatch=useDispatch();
    const Trending=useSelector(store=>store.movies.trendingMovies);
    const getTrendingMovies = async () => {
        const data =await fetch('https://api.themoviedb.org/3/movie/top_rated', API_OPTIONS)
          const json=await data.json();
        //   console.log(json,"popular_movies");
          
          dispatch(addTrendingMovies(json.results))
       }
      if(!Trending){
        getTrendingMovies ()
      }
 }

 export default useTrendingMovies;