import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyDv8rnqdReNWnQowmXS1KPaYy573fbvrs8",
  authDomain: "ieaqui.firebaseapp.com",
  projectId: "ieaqui",
  storageBucket: "ieaqui.appspot.com",
  messagingSenderId: "114811016110",
  appId: "1:114811016110:web:f15ffd61db6ca8ac4aee3f",
  measurementId: "G-73R610QYLT"
};

firebase.initializeApp(firebaseConfig)

export default firebase