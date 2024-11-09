import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCFhufNlOx-beik6dm5RfCIQkZO7dpI0qU",
    authDomain: "beatbonds.firebaseapp.com",
    projectId: "beatbonds",
    storageBucket: "beatbonds.appspot.com",
    messagingSenderId: "655847438300",
    appId: "1:655847438300:web:aed7e8d1861bf0b1164119"
  };


  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth();

  const fstore = firebase.firestore();
export const database = {
  users : fstore.collection('users'),
  admins : fstore.collection('admins')
}

export const storage = firebase.storage();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const githubProvider = new firebase.auth.GithubAuthProvider();


