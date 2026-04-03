import React from "react";
import { useSelector } from "react-redux";
import MovieList from "./MovieList";
import ProviderTopFilters from "./ProviderTopFilters";

function filterMoviesByProviders(movies, selectedIds) {
  if (!selectedIds?.length) return movies;
  return (movies || []).filter((m) => {
    const ids = m.provider_ids || [];
    if (!ids.length) return false;
    return selectedIds.some((sid) => ids.includes(sid));
  });
}

const GptMovieSuggesions = () => {
  const { movieNames, movieResults, selectedProviderIds } = useSelector(
    (store) => store.gpt,
  );
  if (!movieNames) return null;
  return (
    <div className="animate-fade-in mx-4 mb-8 rounded-2xl border border-white/10 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-xl sm:mx-8 md:mx-auto md:max-w-[1600px] md:p-6">
      <ProviderTopFilters />
      {movieResults.map((movie, index) => (
        <MovieList
          key={movieNames[index]}
          title={movieNames[index]}
          movies={filterMoviesByProviders(movie, selectedProviderIds)}
        />
      ))}
    </div>
  );
};

export default GptMovieSuggesions