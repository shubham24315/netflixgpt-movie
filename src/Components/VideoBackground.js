import { useSelector } from 'react-redux'
import useMovieTrailer from '../hooks/useMoiveTrailer'

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280'

const VideoBackground = ({ movieId, backdropPath }) => {
  const trailer = useSelector((state) => state.movies?.trailerVideo)
  useMovieTrailer(movieId)

  const backdropUrl = backdropPath ? `${BACKDROP_BASE}${backdropPath}` : null

  return (
    <div className="relative z-0 w-full overflow-hidden bg-black">
      <div className="aspect-video w-full">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              trailer ? 'opacity-40 lg:opacity-30' : 'opacity-100'
            }`}
          />
        ) : null}
        {trailer ? (
          <iframe
            className="hidden aspect-video h-full w-full border-0 lg:absolute lg:inset-0 lg:block"
            style={{ border: 0 }}
            src={
              'https://www.youtube.com/embed/' +
              trailer.key +
              '?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1'
            }
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:via-transparent lg:to-black/40"
          aria-hidden
        />
      </div>
    </div>
  )
}

export default VideoBackground