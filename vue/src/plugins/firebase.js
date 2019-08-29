import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyDNZbao7Ve17UduyVxVaA64DIJCIWxb144",
  authDomain: "test-nord-clan.firebaseapp.com",
  databaseURL: "https://test-nord-clan.firebaseio.com",
  projectId: "test-nord-clan",
  storageBucket: "test-nord-clan.appspot.com",
  messagingSenderId: "553207842163",
  appId: "1:553207842163:web:8d486483bf3b653c"
}
firebase.initializeApp(config)
firebase.auth().languageCode = 'ru'
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
export const DB = firebase.database()
export default firebase