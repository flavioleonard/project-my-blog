import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm58nNefsCBJ_-4BsfR8KpktB9BW1cQwE",
  authDomain: "miniblog-5eaca.firebaseapp.com",
  projectId: "miniblog-5eaca",
  storageBucket: "miniblog-5eaca.appspot.com",
  messagingSenderId: "165978923394",
  appId: "1:165978923394:web:a693bd46fc8de443106f9b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };