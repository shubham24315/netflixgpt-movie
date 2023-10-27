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
    <div>
        <Header/>
        <div className="absolute">
        <img src={BG_URL} alt="" />
        </div>
        <form onSubmit={(e)=>e.preventDefault()} 
        className="w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white bg-opacity-80">
        <h1 className="font-bold text-xl py-4">{isSignIn? "Sign In":"Sign Out"}</h1>
            <input
            ref={email}
            type="text" placeholder="Email" className="p-4 my-4 w-full bg-gray-700" />
            {!isSignIn && <input type="text"
            ref={name}
            placeholder="Name" className="p-4 my-4 w-full bg-gray-700" />}
            
            <input 
            ref={password}
            type="password" placeholder="Password" className="p-4 my-4 w-full bg-gray-700" />
            <p className="text-red-500 font-bold text-log py-2">{errorMessage?errorMessage:""}</p>
            <button className="p-4 my-6 bg-red-600 w-full" onClick={handleButtonClick}>{isSignIn? "Sign In":"Sign Up"}</button>
            <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>{isSignIn?"New to Netflix? Sign up Now":"Already registered? Sign In Now."}</p>
        </form>
        
    </div>
  )
}

export default Login

//rafce - react arrow function component export