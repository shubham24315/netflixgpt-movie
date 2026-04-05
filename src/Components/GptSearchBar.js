import React, { useRef, useState } from "react";
import lang from "../utils/languageConstants";
import { useSelector } from "react-redux";
import openai from "../utils/openai";
import { API_OPTIONS, TMDB_WATCH_REGION } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addGptMovieResults } from "../utils/gptSlice";
import {
  collectProvidersForMovies,
  enrichMovieLists,
  buildProviderFacetsFromMovies,
  mergeEnrichedMovieRowsToUniqueMovies,
} from "../utils/tmdbWatchProviders";
import { buildGenreFacets } from "../utils/tmdbGenres";
const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langkey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  //movie search in tmdb
  const searchMoiveTMDB = async (movieName) => {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=1`,
      API_OPTIONS,
    );

    const json = await data.json();
    return json.results;
  };
  const handleGptSearchClick = async () => {
    if (!searchText.current?.value?.trim() || isSearching) return;
    setIsSearching(true);
    try {
    const gptQuery =
      "Act as a Movie Recommendation system and suggest some movies for the query : " +
      searchText.current.value +
      ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";
    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuery }],
      model: "deepseek-chat",
    });
    if (!gptResults.choices) {
      return;
    }
    // console.log(gptResults?.choices?.[0].message?.content)
    const gptMovies = gptResults?.choices?.[0].message?.content
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);

    const promiseArray = gptMovies.map((movie) => searchMoiveTMDB(movie));
    const tmdbresults = await Promise.all(promiseArray);

    const uniqueIds = [
      ...new Set(
        tmdbresults.flatMap((row) =>
          (row || []).map((m) => m?.id).filter((id) => id != null),
        ),
      ),
    ];

    const { providersByMovieId, providerMeta } =
      await collectProvidersForMovies(uniqueIds, TMDB_WATCH_REGION);
    const enriched = enrichMovieLists(tmdbresults, providersByMovieId);
    const mergedMovies = mergeEnrichedMovieRowsToUniqueMovies(enriched);
    const providerFacets = buildProviderFacetsFromMovies(mergedMovies, providerMeta);
    const genreFacets = buildGenreFacets(mergedMovies);

    dispatch(
      addGptMovieResults({
        mergedMovies,
        providerFacets,
        genreFacets,
      }),
    );
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <div className="flex justify-center px-4 pb-4 pt-2 sm:px-6">
      <form
        className="flex w-full max-w-2xl flex-col gap-2 rounded-xl border border-white/10 bg-black/65 p-1.5 shadow-lg backdrop-blur-xl sm:flex-row sm:items-stretch sm:gap-1 sm:rounded-lg sm:p-1"
        onSubmit={(e) => {
          e.preventDefault();
          handleGptSearchClick();
        }}
      >
        <input
          ref={searchText}
          type="search"
          disabled={isSearching}
          className="h-11 w-full flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/25 disabled:opacity-60 sm:h-10 sm:border-transparent sm:bg-transparent sm:px-3.5 sm:focus:ring-1"
          placeholder={lang[langkey].gptSearchPlaceholder}
        />
        <button
          type="submit"
          disabled={isSearching}
          className="h-11 shrink-0 rounded-md bg-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-violet-900/25 transition-all duration-200 ease-out-expo hover:bg-violet-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:h-10 sm:px-4"
        >
          {isSearching ? "…" : lang[langkey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
