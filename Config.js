import firebase from "firebase";
require("@firebase/firestore");
var firebaseConfig = {
  apiKey: "AIzaSyCzVfa0ANh3MPsJioYI7jzXOaIke3aWvBM",
  authDomain: "book-santa-bec26.firebaseapp.com",
  projectId: "book-santa-bec26",
  storageBucket: "book-santa-bec26.appspot.com",
  messagingSenderId: "299419529820",
  appId: "1:299419529820:web:96c7174dfb8c843c426c99",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();
