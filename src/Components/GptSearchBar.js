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
  buildProviderFacets,
} from "../utils/tmdbWatchProviders";
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
    const providerFacets = buildProviderFacets(enriched, providerMeta);

    dispatch(
      addGptMovieResults({
        movieNames: gptMovies,
        movieResults: enriched,
        providerFacets,
      }),
    );
    } finally {
      setIsSearching(false);
    }
  };
  return (
    <div className="flex justify-center px-4 pb-8 pt-[10%] sm:pt-[8%]">
      <form
        className="grid w-full max-w-3xl grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-black/70 p-3 shadow-2xl backdrop-blur-xl sm:grid-cols-12 sm:gap-0 sm:p-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleGptSearchClick();
        }}
      >
        <input
          ref={searchText}
          type="search"
          disabled={isSearching}
          className="col-span-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-neutral-500 transition-colors focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-60 sm:col-span-9 sm:mx-2 sm:my-2 sm:border-transparent sm:bg-transparent sm:focus:border-white/20"
          placeholder={lang[langkey].gptSearchPlaceholder}
        />
        <button
          type="submit"
          disabled={isSearching}
          className="rounded-lg bg-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/35 transition-all duration-200 ease-out-expo hover:bg-violet-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:col-span-3 sm:mx-2 sm:my-2"
        >
          {isSearching ? "…" : lang[langkey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
