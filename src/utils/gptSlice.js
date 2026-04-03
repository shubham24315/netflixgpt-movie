import { createSlice } from "@reduxjs/toolkit";

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    mergedMovies: null,
    providerFacets: null,
    genreFacets: null,
    selectedProviderIds: [],
    selectedGenreIds: [],
  },
  reducers: {
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResults: (state, action) => {
      const { mergedMovies, providerFacets, genreFacets } = action.payload;
      state.mergedMovies = mergedMovies;
      state.providerFacets = providerFacets ?? null;
      state.genreFacets = genreFacets ?? null;
      state.selectedProviderIds = [];
      state.selectedGenreIds = [];
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
    toggleGptGenreFilter: (state, action) => {
      const id = action.payload;
      const idx = state.selectedGenreIds.indexOf(id);
      if (idx >= 0) {
        state.selectedGenreIds.splice(idx, 1);
      } else {
        state.selectedGenreIds.push(id);
      }
    },
    clearGptGenreFilters: (state) => {
      state.selectedGenreIds = [];
    },
  },
});

export const {
  toggleGptSearchView,
  addGptMovieResults,
  toggleGptProviderFilter,
  clearGptProviderFilters,
  toggleGptGenreFilter,
  clearGptGenreFilters,
} = gptSlice.actions;
export default gptSlice.reducer;