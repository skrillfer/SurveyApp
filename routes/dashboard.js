/*var express = require('express');
var admin = require('firebase-admin');
var router = express.Router();

router.get('/',function(req,res){
    res.render('dashboard');
});

module.exports = router;

*/
var express = require('express');
var admin = require('firebase-admin');
var router = express.Router();


router.get('/',function(req,res){
    var sessionCookie = req.cookies.session || '';
      // User already logged in. Redirect to profile page.
    admin.auth().verifySessionCookie(sessionCookie).then(function(decodedClaims) {
      res.redirect('/dashboard/overview');
    }).catch(function(error) {
        res.render('login', { title: 'Express' });
    });    
});

/** Get profile endpoint. */
router.get('/overview', function (req, res) {
  // Get session cookie.
  var sessionCookie = req.cookies.session || '';
  // Get the session cookie and verify it. In this case, we are verifying if the
  // Firebase session was revoked, user deleted/disabled, etc.
  admin.auth().verifySessionCookie(sessionCookie, true /** check if revoked. */)
    .then(function(decodedClaims) {
      // Serve content for signed in user.
      //return serveContentForUser('/profile', req, res, decodedClaims);
      console.log(decodedClaims);
      res.render('dashboard')
    }).catch(function(error) {
      // Force user to login.
      res.redirect('/');
    });
});

/** Session login endpoint. */
router.post('/sessionLogin', function (req, res) {
  // Get ID token and CSRF token.
  var idToken = req.body.idToken.toString();
  var csrfToken = req.body.csrfToken.toString();
  
  // Guard against CSRF attacks.
  if (!req.cookies || csrfToken !== req.cookies.csrfToken) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
    return;
  }
  // Set session expiration to 5 days.
  var expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // We could also choose to enforce that the ID token auth_time is recent.
  admin.auth().verifyIdToken(idToken).then(function(decodedClaims) {
    // In this case, we are enforcing that the user signed in in the last 5 minutes.
    if (new Date().getTime() / 1000 - decodedClaims.auth_time < 5 * 60) {
      return admin.auth().createSessionCookie(idToken, {expiresIn: expiresIn});
    }
    throw new Error('UNAUTHORIZED REQUEST!');
  })
  .then(function(sessionCookie) {
    // Note httpOnly cookie will not be accessible from javascript.
    // secure flag should be set to true in production.
    var options = {maxAge: expiresIn, httpOnly: true, secure: false /** to test in localhost */};
    res.cookie('session', sessionCookie, options);
    res.end(JSON.stringify({status: 'success'}));
  })
  .catch(function(error) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
  });
});

/** User signout endpoint. */
router.get('/logout', function (req, res) {
  // Clear cookie.
  var sessionCookie = req.cookies.session || '';
  res.clearCookie('session');
  // Revoke session too. Note this will revoke all user sessions.
  if (sessionCookie) {
    admin.auth().verifySessionCookie(sessionCookie, true).then(function(decodedClaims) {
      return admin.auth().revokeRefreshTokens(decodedClaims.sub);
    })
    .then(function() {
      // Redirect to login page on success.
      res.redirect('/');
    })
    .catch(function() {
      // Redirect to login page on error.
      res.redirect('/');
    });
  } else {
    // Redirect to login page when no session cookie available.
    res.redirect('/');
  }
});

/** User delete endpoint. */
router.get('/encuesta/:org/:id', function (req, res) {

   // Get session cookie.
   var sessionCookie = req.cookies.session || '';
   // Get the session cookie and verify it. In this case, we are verifying if the
   // Firebase session was revoked, user deleted/disabled, etc.
   admin.auth().verifySessionCookie(sessionCookie, true /** check if revoked. */)
     .then(function(decodedClaims) {
       // Serve content for signed in user.
       //return serveContentForUser('/profile', req, res, decodedClaims);
       //console.log("/n/n/n"+decodedClaims);
       //---res.render('dashboard')

       console.log('org:'+req.params.org);
       console.log('id:'+req.params.id);
       res.render('encuesta',{'org':req.params.org,'id':req.params.id})
       //res.redirect('/dashboard/overview');
     }).catch(function(error) {
       // Force user to login.
       res.redirect('/');
     });



});

module.exports = router;
