var express = require('express');
var router = express.Router();

/**
 * Attaches a CSRF token to the request.
 * @param {string} url The URL to check.
 * @param {string} cookie The CSRF token name.
 * @param {string} value The CSRF token value to save.
 * @return {function} The middleware function to run.
 */
function attachCsrfToken(url, cookie, value) {
    
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('csrfToken', (Math.random()* 100000000000000000).toString());
  res.render('index', { title: 'Express' });
});

module.exports = router;