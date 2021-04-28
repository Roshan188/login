import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyAlAU9QA_BdetyXgh7pYYibDks3kwPhVNI",
    authDomain: "login-77d7f.firebaseapp.com",
    projectId: "login-77d7f",
    storageBucket: "login-77d7f.appspot.com",
    messagingSenderId: "528591539243",
    appId: "1:528591539243:web:465de930d624983a92ee6e"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)
  const auth=firebase.auth()
  const provider= new firebase.auth.GoogleAuthProvider()

  export { auth  , provider}