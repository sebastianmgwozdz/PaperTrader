import app from "firebase/app";
import "firebase/auth";

var config = {
  apiKey: "AIzaSyAmP9vHAYXjvQfBkXF8K1Bzv67C5bdlY2o",
  authDomain: "papertrader-312a4.firebaseapp.com",
  databaseURL: "https://papertrader-312a4.firebaseio.com",
  projectId: "papertrader-312a4",
  storageBucket: "papertrader-312a4.appspot.com",
  messagingSenderId: "672884369309",
  appId: "1:672884369309:web:97272ced4cc41670507174",
  measurementId: "G-Z7ZEBHG5CQ"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}
export default Firebase;
