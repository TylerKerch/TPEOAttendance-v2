/**
 * src/Login.js
 */
 import React from "react";
 import {useNavigate} from "react-router-dom";
 import {auth, firebase} from "../Firebase/firebase";
 import GoogleButton from 'react-google-button';
 export default function LoginLink() {
    let navigate = useNavigate();
    async function googleLogin() {
      //1 - init Google Auth Provider
      const provider = new firebase.auth.GoogleAuthProvider();
      //2 - create the popup signIn
      await auth.signInWithPopup(provider).then(
        async (result) => {
          //3 - pick the result and store the token
          const token = await auth?.currentUser?.getIdToken(true);
          //4 - check if have token in the current user
          if (token) {
            //5 - put the token at localStorage (We'll use this to make requests)
            localStorage.setItem("@token", token);
            //6 - navigate user to the home page
            navigate("./", { replace: true });
          }
        },
        function (error) {
          console.log(error);
        }
      );
    }
    return (
        <GoogleButton type="light" onClick={googleLogin}/>
    );
 }
 