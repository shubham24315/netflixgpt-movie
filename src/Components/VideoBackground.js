
import { useSelector } from 'react-redux';
import useMovieTrailer from '../hooks/useMoiveTrailer';
const VideoBackground = ({movieId}) => {
   
    const trailer=useSelector(state=>state.movies?.trailerVideo);
   useMovieTrailer(movieId);
    if(!trailer) return;
  return (
    <div className="w-screen">
        <iframe
        className="w-screen aspect-video hidden xl:block "
        style={{border:0}}
        src={"https://www.youtube.com/embed/"+trailer?.key+"?&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"}
        title="YouTube video player" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        
          allowFullScreen
      
        
        ></iframe>
    </div>
  )
}

export default VideoBackground