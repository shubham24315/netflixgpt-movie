import React from 'react'
import MovieCart from './MovieCart'

const MovieList = ({ title, movies }) => {
  if (!movies?.length) return null

  return (
    <section className="py-2 md:py-4">
        {title ? (
        <h2 className="mb-3 px-1 text-lg font-semibold text-white sm:text-xl md:text-2xl">
          {title}
        </h2>
        ) : null}
        <div className="movie-row -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 pt-1 snap-x snap-mandatory md:gap-4">
            {movies.map((movie) => (
              <MovieCart
                key={movie?.id}
                posterPath={movie?.poster_path}
                title={movie?.title || movie?.name}
              />
            ))}
        </div>
    </section>
  )
}

export default MovieList