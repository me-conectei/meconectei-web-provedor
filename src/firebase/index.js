import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCTjiBVGiO5a8nZL9RO_rwvLK67FJvRqMQ",
  authDomain: "me-conectei.firebaseapp.com",
  projectId: "me-conectei",
  storageBucket: "me-conectei.firebasestorage.app",
  messagingSenderId: "591522733581",
  appId: "1:591522733581:web:d4f271f22441a6327a7f44"
};

firebase.initializeApp(firebaseConfig)

export default firebase