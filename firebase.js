import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCU8k4hkTv-V2H4xC7QS0K7u5cgl6HhX_M",
  authDomain: "revision-app-a3521.firebaseapp.com",
  projectId: "revision-app-a3521",
  storageBucket: "revision-app-a3521.appspot.com",
  messagingSenderId: "87326504243",
  appId: "1:87326504243:web:816058b31563f7c3eeba46",
  measurementId: "G-P7X0D14YM7"
};

let app; 
if (firebase.apps.length == 0) { 
	app = firebase.initializeApp(firebaseConfig); 
} else { 
	app = firebase.app(); 
} 
const auth = firebase.auth(); 
const db = firebase.firestore(); 
  
  
export { auth, db }