import 'firebase/auth';
import 'firebase/database';
import * as firebase from 'firebase/app';
import firebaseConfig from '../firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const DB = firebase.database()
export default firebaseApp