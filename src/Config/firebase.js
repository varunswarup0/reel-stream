import firebase from "firebase";

let firebaseConfig = {
  apiKey: "AIzaSyBe1EekeT_wccXIn_E0AP8skKDqGc4VD90",
  authDomain: "reels-63770.firebaseapp.com",
  projectId: "reels-63770",
  storageBucket: "reels-63770.appspot.com",
  messagingSenderId: "600523866031",
  appId: "1:600523866031:web:dbfaf2b9bf41101da3795a"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
export let firebaseAuth = firebaseApp.auth();
export let firebaseStorage = firebaseApp.storage();
export let firebaseDB = firebaseApp.firestore();
export let timeStamp = firebase.firestore.FieldValue.serverTimestamp;
