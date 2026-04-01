// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { auth, provider } from './config.js'

export default {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      auth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user

          resolve(user)
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message

          reject(errorMessage)
        })
    })
  },
  loggout: () => {
    auth.signOut()
  },
  recoveryPassword: (email) => {
    return new Promise((resolve, reject) => {
      auth
        .sendPasswordResetEmail(email)
        .then((res) => {
          resolve(res)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  googleLogin: async () => {
    return new Promise((resolve, reject) => {
      auth
        .signInWithPopup(provider)
        .then((result) => {
          ///** @type {firebase.auth.OAuthCredential} */
          //var credential = result.credential

          // This gives you a Google Access Token. You can use it to access the Google API.
          //var token = credential.accessToken
          // The signed-in user info.
          var user = result.user
          // IdP data available in result.additionalUserInfo.profile.
          // ...

          resolve(user)
        })
        .catch((error) => {
          // var errorCode = error.code
          // var errorMessage = error.message
          // // The email of the user's account used.
          // var email = error.email
          // // The firebase.auth.AuthCredential type that was used.
          // var credential = error.credential

          reject(error)
        })
    })
  },
  createAccount: async (email, password) => {
    return new Promise((resolve, reject) => {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          userCredential.user.sendEmailVerification()
          const user = userCredential.user

          resolve(user)
          // ...
        })
        .catch((error) => {
          const errorMessage = error.message

          reject(errorMessage)
        })
    })
  },
}
