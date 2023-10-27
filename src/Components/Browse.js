import React from 'react'
import Header from './Header'
import useNowPlayingMovies from '../hooks/useNowPlayingMovies'
import MainContainer from './MainContainer'
import SecondaryContainer from './SecondaryContainer'
import usePopularMovies from '../hooks/usePopularMovies'
import GptSearch from './GptSearch'

import { useSelector } from 'react-redux'
import useTrendingMovies from '../hooks/useTrendingMovies'
import useUpcomingMovies from '../hooks/useUpcomingMoives'
const Browse = () => {
  const showGptSearch=useSelector(store=>store.gpt.showGptSearch);
  useNowPlayingMovies();
  usePopularMovies();
  useTrendingMovies();
  useUpcomingMovies();
  return (
    <div>
      {/* 
        MainContainer
          - videobackground
          - videotitle
        SecondaryContainer
         - movie list *n
         - cards*n
      */}
        <Header/>
        {
          showGptSearch ? <GptSearch/> :
          <>
        <MainContainer/>
        <SecondaryContainer/>
          </>
        }
        

    </div>
  )
}

export default Browse