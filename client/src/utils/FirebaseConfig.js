// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCZJSIyGY7JcEIp0U0RYr703yd1OUU_O_w",
  authDomain: "whatsapp-clone-39500.firebaseapp.com",
  projectId: "whatsapp-clone-39500",
  storageBucket: "whatsapp-clone-39500.appspot.com",
  messagingSenderId: "725502189702",
  appId: "1:725502189702:web:a0b7ad655d9e63695e7107",
  measurementId: "G-J5G96KRP0K",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);


