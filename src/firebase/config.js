// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/storage"


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8Dxr-cKAE5bSN1BllWiqdiTe6S-W4Ao4",
    authDomain: "virtualclassroom-24072.firebaseapp.com",
    projectId: "virtualclassroom-24072",
    storageBucket: "virtualclassroom-24072.appspot.com",
    messagingSenderId: "405633106869",
    appId: "1:405633106869:web:12f48a46ab97f5bb44cffc"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth=firebase.auth();
const db=firebase.firestore();
const provider=new firebase.auth.GoogleAuthProvider();
const storage=firebase.storage();

export {auth,provider,storage};
export default db;
