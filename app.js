var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var http = require('http');
var https = require('https');
var admin = require('firebase-admin');
var bodyParser = require('body-parser');

var generalRouter = require('./routes/general');
var loginRouter = require('./routes/login');
var dashboardRouter = require('./routes/dashboard');
var app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/",generalRouter);
app.use("/users",loginRouter);
app.use("/dashboard",dashboardRouter);

// Initialize Admin SDK.
admin.initializeApp({
  credential: admin.credential.cert('proysurveys-0c5b351e72f8.json')
});
// Support JSON-encoded bodies.
app.use(bodyParser.json());
// Support URL-encoded bodies.
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
   res.locals = {
     "sessionCookie": (req.cookies.session || '')
   };
   next();
});

// Start http server and listen to port 3000.
app.listen(3000, function () {
  console.log('Sample app listening on port 3000!')
})

