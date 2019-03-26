var express = require('express');
var admin = require('firebase-admin');
var router = express.Router();


router.get('/',function(req,res){
    res.render('builder',{encuesta:''});
});

router.get('/edit/:id',function(req,res,next){
    var base64Id = req.params.id;
    var token = Buffer.from(base64Id,'base64').toString('ascii');
    var arrData = token.split('|');
    console.log(arrData);
    if(arrData['1']=='encuestas'){
        var database = admin.database().ref('proyectos/'+arrData[0]+'/'+arrData[1]+'/'+arrData[2]).once('value').then(function(snapshot){
            var jsonEncuesta = snapshot.val().encuesta;
            var tituloEncuesta = snapshot.val().nombre;
            if(jsonEncuesta!=""){
                res.render('builder', { encuesta:JSON.stringify(jsonEncuesta),titulo:tituloEncuesta,organizacion:arrData[1],idencuesta:base64Id,intIdEncuesta:arrData[2]});
            }else{
                res.redirect('/');
            }
        });
    }else{
        res.redirect('/');
    }
});

module.exports = router;
