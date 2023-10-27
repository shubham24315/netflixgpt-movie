import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { API_OPTIONS } from '../utils/constants'
import { addPopularMovies } from '../utils/movieSlice'
import { useSelector } from 'react-redux'
const usePopularMovies = () => {
    const dispatch=useDispatch();
    const popularMovies=useSelector(store=>store.movies.popularMovies);
    useEffect(() => {
      const getPopularMovies = async () => {
        const data =await fetch('https://api.themoviedb.org/3/movie/popular', API_OPTIONS)
          const json=await data.json();
          // console.log(json,"popular_movies");
          
          dispatch(addPopularMovies(json.results))
       }
      if(!popularMovies){
       getPopularMovies()
      }
    }, [])
}

export default usePopularMovies;