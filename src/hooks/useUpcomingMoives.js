import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { API_OPTIONS } from '../utils/constants'
import { useSelector } from 'react-redux'
import { addUpcomingMovies } from '../utils/movieSlice'
const useUpcomingMovies = () => {
    const dispatch=useDispatch();
    const Trending=useSelector(store=>store.movies.upcomingMovies);
    const getUpcomingMovies = async () => {
        const data =await fetch('https://api.themoviedb.org/3/movie/upcoming', API_OPTIONS)
          const json=await data.json();
          console.log(json,"upcoming movies");
          
          dispatch(addUpcomingMovies(json.results))
       }
      if(!Trending){
        getUpcomingMovies ()
      }

}
export default useUpcomingMovies;