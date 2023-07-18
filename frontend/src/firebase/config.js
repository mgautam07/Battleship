// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACg5VE1gX5Z93nnSoWcIt17CS6nrW9f7s",
  authDomain: "battleship-19578.firebaseapp.com",
  projectId: "battleship-19578",
  storageBucket: "battleship-19578.appspot.com",
  messagingSenderId: "164093526075",
  appId: "1:164093526075:web:59ab0e361aa3e69cdf5c1e"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)