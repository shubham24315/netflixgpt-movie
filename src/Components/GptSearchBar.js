import React from "react";
import lang from "../utils/languageConstants";
import { useSelector } from "react-redux";
import { useRef } from "react";
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
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
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
    // console.log(searchText.current.value);
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
  };
  return (
    <div className="pt-[10%] flex justify-center">
      <form
        form
        className="w-1/2 bg-black grid grid-cols-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className="p-4 m-4 col-span-9"
          placeholder={lang[langkey].gptSearchPlaceholder}
        />
        {/* to make it dynamic you to give lang[langkey] */}
        <button
          className="py-2 px-4 bg-red-400 text-white col-span-3 m-4"
          onClick={handleGptSearchClick}
        >
          {lang[langkey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
