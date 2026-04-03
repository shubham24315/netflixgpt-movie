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
    <div className="p-4 m-4 bg-black text-white bg-opacity-90">
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