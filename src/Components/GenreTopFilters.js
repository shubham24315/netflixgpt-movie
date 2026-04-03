import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleGptGenreFilter,
  clearGptGenreFilters,
} from "../utils/gptSlice";

const GenreTopFilters = () => {
  const dispatch = useDispatch();
  const { genreFacets, selectedGenreIds } = useSelector((store) => store.gpt);

  if (!genreFacets?.length) return null;

  return (
    <div className="mb-6 px-2">
      <div className="mb-2 flex items-center gap-3">
        <span className="shrink-0 text-sm text-gray-400">Genres</span>
        {selectedGenreIds.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch(clearGptGenreFilters())}
            className="shrink-0 text-xs text-red-400 transition-colors hover:text-red-300 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-nowrap">
        {genreFacets.map((f) => {
          const active = selectedGenreIds.includes(f.genre_id);
          return (
            <button
              key={f.genre_id}
              type="button"
              onClick={() => dispatch(toggleGptGenreFilter(f.genre_id))}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 ease-out active:scale-[0.97] ${
                active
                  ? "border-violet-500 bg-violet-950/50 text-white shadow-md shadow-violet-900/20"
                  : "border-gray-600/80 bg-gray-900/70 text-gray-200 hover:border-gray-400 hover:bg-gray-800/80"
              }`}
            >
              <span>{f.genre_name}</span>
              <span className="ml-1 text-xs text-gray-500">({f.count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenreTopFilters;
