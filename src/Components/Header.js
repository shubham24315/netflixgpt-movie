import React from 'react'
import {  signOut } from "firebase/auth";
import {auth} from "../utils/firebase"
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice'
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import {LOGO, SUPPORTED_LANGUAGES, USER_AVATAR} from "../utils/constants"
import { toggleGptSearchView } from '../utils/gptSlice';
import { changeLanguage } from '../utils/configSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user=useSelector(store=>store.user);
    const showGptSearch=useSelector(store=>store.gpt.showGptSearch);
    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate("/")
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
    }
    useEffect(()=>{
   const unsubscribe= onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const {uid,email,displayName} = user;
            // ...
            dispatch(addUser({uid:uid,email:email,displayName:displayName}))
            navigate("/Browse")
          } else {
            // User is signed out
            // ...
            dispatch(removeUser())
            navigate("/")
          }  
        });
        return ()=> unsubscribe();
      //unsubscribe function is return by OnAuthStateChanged if we call it it will remove onAuthStateChanged from the browser.
    },[])
    const handleGptSearch=()=>{
     //toggle gpt search button
     dispatch(toggleGptSearchView());
    }
    const handleLanguageChange=(e)=>{
      // console.log(e.target.value);
      dispatch(changeLanguage(e.target.value));
    }
  return (
    <div className="absolute px-8 py-2 bg-gradient-to-b from-black z-10 w-screen flex justify-between ">
        <img 
        className="w-44"
        src={LOGO} alt="" />
       {user && <div className="flex p-2">
           { showGptSearch &&
            <select name="" id="" className="p-2 bg-gray-900 text-white" onChange={handleLanguageChange}>
            {SUPPORTED_LANGUAGES.map(lang =>  <option key={lang.identifier} value={lang.identifier}>{lang.name}</option>
              )}
           
           </select>}
            <button className="py-2 px-4 mx-4 my-2 bg-purple-500 text-white" onClick={handleGptSearch}
            >{showGptSearch?"Home Page":"GPT Search"}</button>
            <img 
            className="w-12 h-12"
            src={USER_AVATAR} alt="" />
            <button className="font-bold text-white" onClick={handleSignOut}>Sign Out</button>
        </div>
        }
    </div>
  )
}

export default Header