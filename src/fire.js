import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyCvxmJXWdOQsBw6QkcH7MTghBk8YjBNnHo",
  authDomain: "track-my-goals.firebaseapp.com",
  databaseURL: "https://track-my-goals.firebaseio.com",
  projectId: "track-my-goals",
  storageBucket: "track-my-goals.appspot.com",
  messagingSenderId: "1045953614271"
};

firebase.initializeApp(config);

export const db = firebase.firestore();

export const auth = () => firebase.auth();

// export const mode = "real"

// export default fire
