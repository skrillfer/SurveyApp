var express = require('express');
var admin = require('firebase-admin');
var router = express.Router();

router.get('/',function(req,res){
    res.render('dashboard');
});

module.exports = router;
