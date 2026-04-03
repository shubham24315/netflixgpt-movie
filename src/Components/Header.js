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
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-4 bg-gradient-to-b from-black/95 via-black/70 to-transparent backdrop-blur-md transition-[background,backdrop-filter] duration-300">
        <img
        className="h-7 w-auto sm:h-8 object-contain select-none"
        src={LOGO} alt="Netflix" />
       {user && (
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
           {showGptSearch && (
            <select
              aria-label="Language"
              className="rounded-md border border-white/15 bg-black/60 px-3 py-2 text-sm text-white shadow-inner backdrop-blur-sm transition-colors hover:border-white/25 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
              onChange={handleLanguageChange}
            >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.identifier} value={lang.identifier}>
                {lang.name}
              </option>
            ))}
           </select>
           )}
            <button
              type="button"
              className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-900/30 transition-all duration-200 ease-out-expo hover:bg-violet-500 hover:shadow-violet-800/40 active:scale-[0.98]"
              onClick={handleGptSearch}
            >
              {showGptSearch ? "Home" : "GPT Search"}
            </button>
            <img
            className="h-9 w-9 rounded-sm object-cover ring-1 ring-white/20"
            src={USER_AVATAR} alt="" />
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white active:scale-[0.98]"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
        </div>
       )}
    </header>
  )
}

export default Header