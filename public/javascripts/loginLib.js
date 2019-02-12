/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*var firebase = require('firebase');
var firebaseui = require('firebaseui');
var config = require('./config.js');
var $ = require('jquery');*/

/**
 * @param {string} name The cookie name.
 * @return {?string} The corresponding cookie value to lookup.
 */
function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

/**
 * @return {!Object} The FirebaseUI config.
 */
function getUiConfig() {
  // This configuration supports email/password and Google providers.
  return {
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccessWithAuthResult':function(authResult, redirectUrl) {
        if(authResult.user){
          handleSignedInUser(authResult.user);
          console.log('hay usuario');
        }else{
          console.log('no hay usuario');
        }
        return false;
      },
      'signInSuccess': function(user, credential, redirectUrl) {
        console.log("evento signInSuccess");
        // Handle signed in user.
        handleSignedInUser(user);
        // Do not automatically redirect.
        return false;
      },
      'uiShown': function() {
        // Remove progress bar when the UI is ready.
        $('#loading').addClass('hidden');
      }
    },
    'signInFlow': 'popup',
    'signInOptions': [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID
      },
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // Whether the display name should be displayed in Sign Up page.
        requireDisplayName: true
      }
    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com',
    'credentialHelper': firebaseui.auth.CredentialHelper.NONE
  };
}

/**
 * Handles a signed in user. Sets the session cookie and then redirects to
 * profile page on success.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function(user) {
  console.log("handle");
  // Show redirection notice.
  document.getElementById('redirecting').classList.remove('hidden');
  // Set session cookie
  user.getIdToken().then(function(idToken) {
    // Session login endpoint is queried and the session cookie is set.
    // CSRF token should be sent along with request.
    var csrfToken = getCookie('csrfToken')
    return postIdTokenToSessionLogin('/users/sessionLogin', idToken, csrfToken)
      .then(function() {
        // Redirect to profile on success.
        window.location.assign('/dashboard/');
      }, function(error) {
        console.log("error al iniciar sesión");
        // Refresh page on error.
        // In all cases, client side state should be lost due to in-memory
        // persistence.
        //window.location.assign('/');
      });
  });
};

/**
 * @param {string} url The session login endpoint.
 * @param {string} idToken The ID token to post to backend.
 * @param {?string} csrfToken The CSRF token to send to backend.
 * @return {jQuery.jqXHR<string>} A jQuery promise that resolves on completion.
 */
var postIdTokenToSessionLogin = function(url, idToken, csrfToken) {
  // POST to session login endpoint.
  return $.ajax({
    type:'POST',
    url: url,
    data: {idToken: idToken, csrfToken: csrfToken},
    contentType: 'application/x-www-form-urlencoded'
  });
};

var globalUserObject = {};


/**
 * Initializes the app.
 */
var initApp = function() {
  // Renders sign-in page using FirebaseUI.
  ui.start('#firebaseui-container', getUiConfig());
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {      
      // User is signed in.
      console.log(user);
      var displayName = user.displayName;
      if((displayName==null || displayName=='')) displayName='(no name)';
      var email = user.email;
      $('#nomUsuario').html(displayName+'<br/>('+email+')');
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var uid = user.uid;
      globalUserObject['uid']=uid;
      var phoneNumber = user.phoneNumber;
      var providerData = user.providerData;
      user.getIdToken().then(function(accessToken) {
        //ESTA FORMA PODRÍA ACELERAR LA DESCARGA DEL USUARIO
        //database.ref('/proyectos').orderByChild('usuarios/BWz5IL9oc0Nq84uxVd3T3x528I03').startAt('').once('value').then(function(snap){ console.log('hola'); snap.forEach(function(child){ console.log(child.key); }) })
        console.log("/usuarios/"+globalUserObject['uid']+"/organizaciones");
        database.ref('/usuarios/'+globalUserObject['uid']+'/organizaciones').once('value').then(function(snapshot) {
            console.log("trae la data de colecciones");
            var collOrganizaciones = [];
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                collOrganizaciones.push(childKey);
            });
            database.ref('/proyectos').once('value').then(function(snapshot){
              var collOrgs = [];
              snapshot.forEach(function(childSnapshot){
                if(collOrganizaciones.indexOf(childSnapshot.key)){
                  collOrgs.push(childSnapshot);
                }
              });
              globalUserObject['organizaciones']=collOrgs;
            });
        });
        document.getElementById('account-details').textContent = JSON.stringify({
          displayName: displayName,
          email: email,
          emailVerified: emailVerified,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          uid: uid,
          accessToken: accessToken,
          providerData: providerData
        }, null, '  ');
      });
    } else {
      console.log("no hay usuario");
    }
  }, function(error) {
    console.log(error);
  });
};

// Initialize Firebase app.
firebase.initializeApp(config);
var database = firebase.database();
// Set persistence to none.
//firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// On page ready, initialize app.
window.addEventListener('load', initApp);
