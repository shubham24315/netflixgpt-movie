import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    movieResults: null,
    movieNames: null,
    providerFacets: null,
    selectedProviderIds: [],
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResults: (state, action) => {
      const { movieNames, movieResults, providerFacets } = action.payload;
      state.movieNames = movieNames;
      state.movieResults = movieResults;
      state.providerFacets = providerFacets ?? null;
      state.selectedProviderIds = [];
    },
    toggleGptProviderFilter: (state, action) => {
      const id = action.payload;
      const idx = state.selectedProviderIds.indexOf(id);
      if (idx >= 0) {
        state.selectedProviderIds.splice(idx, 1);
      } else {
        state.selectedProviderIds.push(id);
      }
    },
    clearGptProviderFilters: (state) => {
      state.selectedProviderIds = [];
    },
  },
});

export const {
  toggleGptSearchView,
  addGptMovieResults,
  toggleGptProviderFilter,
  clearGptProviderFilters,
} = gptSlice.actions;
export default gptSlice.reducer;