const config = {
  apiKey: "AIzaSyBvXXZwnBCJ3Z0iWQAFtqI9Q8ixZelhvGU",
  authDomain: "bdsurvey-4d97c.firebaseapp.com",
  databaseURL: "https://bdsurvey-4d97c.firebaseio.com",
  projectId: "bdsurvey-4d97c",
  storageBucket: "bdsurvey-4d97c.appspot.com",
  messagingSenderId: "792353618616"
};
firebase.initializeApp(config);

const storage = firebase.storage().ref();

this.db = firebase.database();
this.auth = firebase.auth();

/* API AUTH */

doCreateUserWithEmailAndPassword = (email, password) =>
  this.auth.createUserWithEmailAndPassword(email, password);

doSignInWithEmailAndPassword = (email, password) =>
  this.auth.signInWithEmailAndPassword(email, password);

doSignOut = () => this.auth.signOut();

doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

doPasswordUpdate = password =>
  this.auth.currentUser.updatePassword(password);


/* FIREBASE SURVEY APP */

FIREBASE_ORGS = () => this.db.ref('proyectos/');

FIREBASE_ORGA = uid => this.db.ref(`proyectos/${uid}/encuestas`);

//FIREBASE_ORGA_ENCUESTA = uid => this.db.ref(`proyectos/${uid}`);

