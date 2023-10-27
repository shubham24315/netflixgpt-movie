 import { createSlice } from "@reduxjs/toolkit";
 

 const moveSlice = createSlice({
        name: "movies",
        initialState: {
            nowPlayingMovies:null,
            trailerVideo:null,
            popularMovies:null,
            trendingMovies:null,
            upcomingMovies:null,
        },
        reducers:{
            addNowPlayingMovies: (state,action) => {
                state.nowPlayingMovies=action.payload;
            },
            addTrailerVideo: (state,action) => {
               state.trailerVideo=action.payload;
            },
            addPopularMovies: (state,action) => {
                // console.log(action.payload,"popularMovies")
                state.popularMovies=action.payload;
            },
            addTrendingMovies: (state,action) => {
                
                state.trendingMovies=action.payload;
            },
            addUpcomingMovies: (state,action) => {
                
                state.upcomingMovies=action.payload;
            },
        }
 });

 export default moveSlice.reducer;
    export const {addNowPlayingMovies,addTrailerVideo,addPopularMovies,addUpcomingMovies,addTrendingMovies}=moveSlice.actions;