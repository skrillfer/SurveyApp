var express = require('express');
var firebase = require('firebase-admin');
var router = express.Router();

/** Links con un base64 con esta estructura organizacionsurvey|encuestas|20190122_1700 */
router.get('/:id', function(req, res, next) {
    var base64Id = req.params.id;
    var token = Buffer.from(base64Id,'base64').toString('ascii');
    var arrData = token.split('|');
    console.log(arrData);
    if(arrData['1']=='encuestas'){
        var database = firebase.database().ref('proyectos/'+arrData[0]+'/'+arrData[1]+'/'+arrData[2]).once('value').then(function(snapshot){
            var jsonEncuesta = snapshot.val().encuesta;
            var tituloEncuesta = snapshot.val().nombre;
            if(jsonEncuesta!=""){
                res.render('encuesta/index', { title: 'Encuesta pública',encuesta:jsonEncuesta,titulo:tituloEncuesta,idencuesta:base64Id});
            }else{
                res.redirect('/');
            }
        });
    }else{
        res.redirect('/');
    }
});

router.post('/:id', function(req, res, next) {
    var strIdToken = req.params.id.toString();
    var strRespuesta = req.body.strrespuesta.toString();
    var token = Buffer.from(strIdToken,'base64').toString('ascii');
    var arrData = token.split('|');
    if(arrData[1]=='encuestas'){
        var objJson = JSON.parse(strRespuesta);
        var encuestaNueva = firebase.database().ref('proyectos/' + arrData[0]+'/respuestas/'+arrData[2]).push();
        encuestaNueva.set(
            {
                "body":objJson,
                "date":(new Date().getTime()),
                "longitude":0,
                "latitude":0,
                "userHash":"anonymous"
            }
        );
        res.send('{"status":"ok"}');
    }
});

router.get('/usuarios/:id',function(req,res,next){
    var base64Id = req.params.id;
    var token = Buffer.from(base64Id,'base64').toString('ascii');
    var arrData = token.split('|');
    console.log(arrData);
    if(arrData['1']=='encuestas'){
        var database = firebase.database().ref('proyectos/'+arrData[0]+'/'+arrData[1]+'/'+arrData[2]).once('value').then(function(snapshot){
            var jsonEncuesta = snapshot.val().encuesta;
            var tituloEncuesta = snapshot.val().nombre;
            
            res.render('encuesta/usuarios', { title: 'Encuesta pública',encuesta:jsonEncuesta,titulo:tituloEncuesta,idencuesta:base64Id});
        });
    }else{
        res.redirect('/');
    }
});

module.exports = router;