var express = require('express');
var firebase = require('firebase-admin');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('organizacion/usuarios.ejs', { title: 'Encuesta pública',encuesta:jsonEncuesta,titulo:tituloEncuesta,idencuesta:base64Id});
});

module.exports = router;