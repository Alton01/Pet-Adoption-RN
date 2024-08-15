// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKN4C0I_H6Ujeg_gATJIZXadZOR4sew5w",
  authDomain: "adopt-pet-f5fb7.firebaseapp.com",
  projectId: "adopt-pet-f5fb7",
  storageBucket: "adopt-pet-f5fb7.appspot.com",
  messagingSenderId: "981631161329",
  appId: "1:981631161329:web:b58ff93ad95f82dff9ea50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

export const storage = getStorage(app)

