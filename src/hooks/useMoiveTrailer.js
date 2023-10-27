import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addTrailerVideo } from "../utils/movieSlice";
import { API_OPTIONS } from "../utils/constants";
import { useSelector } from "react-redux";
const useMovieTrailer = (movieId) => {
    const dispatch=useDispatch();
    const trailerVideo=useSelector(store=>store.movies.trailerVideo);
    useEffect(() => {
        const getMovieVideos=async()=>{
            const data =await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, API_OPTIONS);
            const json=await data.json();
            
            const filterData=json.results.filter(video=> video.type==="Trailer");
            const trailer=filterData.length? filterData[0]:json.results[0];
             

            // console.log(trailer,"trailer")
            dispatch(addTrailerVideo(trailer))
        }
        if(!trailerVideo){
            getMovieVideos();
        }
       
    }, [])
}
export default useMovieTrailer;