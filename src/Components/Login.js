import React from 'react'
import Header from './Header'
import { useState } from 'react'
import { checkValidData } from '../utils/validate'
import { useRef } from 'react'
import {  createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../utils/firebase"
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { BG_URL } from '../utils/constants'
const Login = () => {
    const dispatch = useDispatch();
   
    const [isSignIn, setIsSignIn] = useState(true) // [state, setState
    const [errorMessage, setErrorMessage] = useState(null)
    const email=useRef(null);
    const password=useRef(null);
    const name=useRef(null);
    const toggleSignInForm = () => {
        setIsSignIn(!isSignIn)
    }
    const handleButtonClick = async() => {
        //validate the form data
      const message= checkValidData(email.current.value,password.current.value)
      // console.log(message)
      setErrorMessage(message)
      if(message) return;

      //Sign In Sign up Logic
      if(!isSignIn){
        //sign up logic
        createUserWithEmailAndPassword(auth, email.current.value,password.current.value)
        .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          // console.log(user);
          updateProfile(user, {
            displayName: name.current.value
          }).then(() => {
            // Profile updated!
            // ...
            const {uid,email,displayName} = auth.currentUser;
          // ...
          dispatch(addUser({uid:uid,email:email,displayName:displayName}))  
          //from the updated value of the user we are trying to update       
           
          }).catch((error) => {
            // An error occurred
            // ...
            setErrorMessage(error.code+"_"+error.message)
          });
          // ...
         
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // console.log(error.code,error.message);
          // ..
          setErrorMessage(errorCode+"_"+errorMessage)
        });
      }
      else{
       //sign in logic
       signInWithEmailAndPassword(auth, email.current.value, password.current.value)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // console.log(user);
    // ...
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setErrorMessage(errorCode+"_"+errorMessage)
  });
      }
    }
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
        <Header/>
        <div className="fixed inset-0 -z-10">
        <img
          src={BG_URL}
          alt=""
          className="h-full w-full object-cover object-center scale-105 brightness-[0.35]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" aria-hidden />
        </div>
        <form
        onSubmit={(e) => e.preventDefault()}
        className="relative z-10 mx-auto mt-24 w-full max-w-md rounded-2xl border border-white/10 bg-black/75 p-8 text-white shadow-2xl shadow-black/50 backdrop-blur-xl sm:mt-28 md:mt-32 md:p-10"
        >
        <h1 className="text-3xl font-bold tracking-tight">
          {isSignIn ? 'Sign In' : 'Sign Up'}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          {isSignIn ? 'Welcome back.' : 'Create your account to continue.'}
        </p>
            <div className="mt-8 space-y-4">
            <input
            ref={email}
            type="email"
            autoComplete="email"
            placeholder="Email"
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-neutral-500 transition-colors focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            {!isSignIn && (
            <input
            type="text"
            ref={name}
            autoComplete="name"
            placeholder="Name"
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-neutral-500 transition-colors focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            )}
            <input
            ref={password}
            type="password"
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
            placeholder="Password"
            className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-neutral-500 transition-colors focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            </div>
            {errorMessage ? (
            <p className="mt-4 rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/30" role="alert">
              {errorMessage}
            </p>
            ) : null}
            <button
            type="button"
            className="mt-6 w-full rounded-md bg-accent py-3.5 text-base font-semibold text-white shadow-lg shadow-red-900/40 transition-all duration-200 ease-out-expo hover:bg-accent-hover active:scale-[0.99]"
            onClick={handleButtonClick}
            >
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
            <button
            type="button"
            className="mt-6 w-full text-left text-sm text-neutral-300 transition-colors hover:text-white"
            onClick={toggleSignInForm}
            >
              {isSignIn
                ? 'New to Netflix? Sign up now'
                : 'Already registered? Sign in'}
            </button>
        </form>
    </div>
  )
}

export default Login

//rafce - react arrow function component export