import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDsjF-JjHgG-W8oGKIY3FxzU2IKA8Qk9oc",
    authDomain: "webpage-builder-53619.firebaseapp.com",
    projectId: "webpage-builder-53619",
    storageBucket: "webpage-builder-53619.appspot.com",
    messagingSenderId: "906482353787",
    appId: "1:906482353787:web:bac56f33716f5a6ca744de"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);