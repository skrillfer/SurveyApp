import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
     apiKey: "AIzaSyBvXXZwnBCJ3Z0iWQAFtqI9Q8ixZelhvGU",
    authDomain: "bdsurvey-4d97c.firebaseapp.com",
    databaseURL: "https://bdsurvey-4d97c.firebaseio.com",
    projectId: "bdsurvey-4d97c",
    storageBucket: "bdsurvey-4d97c.appspot.com",
    messagingSenderId: "792353618616"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');
}

export default Firebase;
