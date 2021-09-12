import firebase from 'firebase/app';
import 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyDEIwNd9kHHYmeF1P9CFW19RFxixkjO1jo',
  authDomain: 'e-commerce-8a624.firebaseapp.com',
  projectId: 'e-commerce-8a624',
  storageBucket: 'e-commerce-8a624.appspot.com',
  messagingSenderId: '39425740559',
  appId: '1:39425740559:web:8d38a6a1c67483ff32b87a',
};
// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

//export
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
