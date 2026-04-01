// Import the functions you need from the SDKs you need
import 'firebase/compat/auth'
import firebase from 'firebase/compat/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDijbVV1SE8PNFF3WpyD5U4nrIJfNZAG_4',
  authDomain: 'inovarc-news.firebaseapp.com',
  projectId: 'inovarc-news',
  storageBucket: 'inovarc-news.firebasestorage.app',
  messagingSenderId: '380297741938',
  appId: '1:380297741938:web:9de50838fa36daec2164eb',
  measurementId: 'G-R13K34BY8W',
}

// Initialize Firebase
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
