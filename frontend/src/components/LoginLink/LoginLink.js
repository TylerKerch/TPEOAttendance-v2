 import React from "react";
 import {useNavigate} from "react-router-dom";
 import {auth, firebase} from "components/Firebase/firebase";
 import GoogleButton from 'react-google-button';
 import {Text} from '@mantine/core';

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
            localStorage.setItem("@attendanceToken", token);
            //6 - navigate user to the home page
            navigate("/");
          }
        },
        function (error) {
          console.log(error);
        }
      );
    }
    return (
      <div style={{left: '50%', top: '50%', position: 'absolute', transform: 'translate(-50%, -50%)'}}>
        <Text style={{whiteSpace: 'nowrap', fontSize: '600%'}}>Log In</Text>
        <GoogleButton style={{left: '50%', marginTop: '30px', position: 'absolute', transform: 'translate(-50%, -50%)'}} type="light" onClick={googleLogin}/>
      </div>
    );
 }
 