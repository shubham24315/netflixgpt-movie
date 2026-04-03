import React from "react";
import { useSelector } from "react-redux";
import MovieCart from "./MovieCart";
import GptFacetDropdowns from "./GptFacetDropdowns";

function filterMoviesByProviders(movies, selectedIds) {
  if (!selectedIds?.length) return movies;
  return (movies || []).filter((m) => {
    const ids = m.provider_ids || [];
    if (!ids.length) return false;
    return selectedIds.some((sid) => ids.includes(sid));
  });
}

function filterMoviesByGenres(movies, selectedGenreIds) {
  if (!selectedGenreIds?.length) return movies;
  return (movies || []).filter((m) =>
    (m.genre_ids || []).some((gid) => selectedGenreIds.includes(gid)),
  );
}

const GptMovieSuggesions = () => {
  const { mergedMovies, selectedProviderIds, selectedGenreIds } = useSelector(
    (store) => store.gpt,
  );
  if (mergedMovies == null) return null;

  if (mergedMovies.length === 0) {
    return (
      <div className="animate-fade-in mx-4 mb-8 rounded-2xl border border-white/10 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-xl sm:mx-8 md:mx-auto md:max-w-[1600px] md:p-6">
        <p className="py-10 text-center text-sm text-neutral-400">
          No movies matched this search. Try a different description.
        </p>
      </div>
    );
  }

  const filtered = filterMoviesByGenres(
    filterMoviesByProviders(mergedMovies, selectedProviderIds),
    selectedGenreIds,
  );

  return (
    <div className="animate-fade-in mx-4 mb-8 rounded-2xl border border-white/10 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-xl sm:mx-8 md:mx-auto md:max-w-[1600px] md:p-6">
      <GptFacetDropdowns />
      {filtered.length === 0 ? (
        <p className="px-2 py-8 text-center text-sm text-neutral-400">
          No titles match the selected filters. Try clearing genre or provider
          filters.
        </p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-2 gap-4 px-1 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 sm:gap-5">
          {filtered.map((movie) => (
            <li key={movie.id} className="min-w-0">
              <MovieCart
                variant="grid"
                movieId={movie?.id}
                posterPath={movie?.poster_path}
                title={movie?.title || movie?.name}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GptMovieSuggesions