import React from 'react'
import { useSelector } from 'react-redux'
import MovieList from './MovieList'
const GptMovieSuggesions = () => {
  const {movieNames,movieResults}=useSelector(store=>store.gpt);
  if(!movieNames) return;
  return (
    <div className="p-4 m-4 bg-black text-white bg-opacity-90">
      {movieResults.map((movie,index)=>      
      (<MovieList key={movieNames[index]} title={movieNames[index]} movies={movie}/>
      ))}
     

    </div>
  )
}

export default GptMovieSuggesions