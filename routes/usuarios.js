var express = require('express');
var admin = require('firebase-admin');
var router = express.Router();

function listaUsuarios(idusuario,res,params){
    var collUsuarios = {};
    admin.database().ref('usuarios/'+idusuario).once('value').then(function(snapshot){
        let collOrgs = snapshot.val().organizaciones;
        for(let k in collOrgs){
            admin.database().ref('proyectos/'+k+'/usuarios').once('value').then(function(snap){
                var cantUsers=0;
                let collUsers = snap.val();
                for(let u in collUsers){
                    cantUsers = cantUsers+1;
                    admin.auth().getUser(u).then(function(data){
                        let tmpUsuarios = collUsuarios[k];
                        if(tmpUsuarios==null||tmpUsuarios==undefined){
                            tmpUsuarios=[];
                        }
                        tmpUsuarios.push({
                            "email":data.email,
                            "displayName":(data.displayName) ? data.displayName : collUsers[u],
                            "issame":(idusuario==data.uid) ? true : false,
                            "uid":data.uid
                        });  //TO-DO: Change collUsers to reactive programming
                        collUsuarios[k]=tmpUsuarios;
                        cantUsers = cantUsers-1;
                        if(cantUsers==0){
                            params['usuarios']=collUsuarios;
                            res.render('organizacion/usuarios.ejs', params);
                        }
                    });
                }
            });
        }
    });
}

router.get('/', function(req, res, next) {
    var sessionCookie = req.cookies.session || '';
    admin.auth().verifySessionCookie(sessionCookie, true /** check if revoked. */)
    .then(function(decodedClaims) {
        listaUsuarios(decodedClaims.uid,res,{});
        /*admin.auth().listUsers(1000).then(function(listUsers){
            var arrUsuarios = [];
            admin.database.ref('proyectos/')
            /*listUsers.users.forEach(function(userRecord){
                arrUsuarios.push({"displayName":userRecord.displayName,"email":userRecord.email});
            });*/
            /*res.render('organizacion/usuarios.ejs', { usuarios:arrUsuarios});
        }).catch(function(error){
            console.log("error obteniendo usuarios:"+error);
        });*/
    }).catch(function(error) {
        console.log(error);
      // Force user to login.
      res.redirect('/');
    });
});

router.post('/', function(req, res, next) {
    var strEmail = (req.body.emailUsuario) ? req.body.emailUsuario.toString() : '';
    var nomOrg = (req.body.nomOrganizacion) ? req.body.nomOrganizacion.toString() : '';
    var uidNuevoUsuario = (req.body.uidNuevoUsuario) ? req.body.uidNuevoUsuario.toString() : '';
    var nameNuevoUsuario = (req.body.nameNuevoUsuario) ? req.body.nameNuevoUsuario.toString() : '';
    var sessionCookie = req.cookies.session || '';
    admin.auth().verifySessionCookie(sessionCookie, true /** check if revoked. */)
    .then(function(decodedClaims) {
        if(strEmail!=""){
            var arrUsuarios = [];
            admin.auth().getUserByEmail(strEmail).then(function(usrObject){
                admin.database().ref('usuarios/'+usrObject.uid).once('value').then(function(snapshot){
                    let nomUsuario = snapshot.val().nombre;
                    let displayName = (usrObject.displayName!='' && usrObject.displayName!=undefined) ? usrObject.displayName : nomUsuario;
                    listaUsuarios(decodedClaims.uid,res,{"usuarioNuevo":{"displayName":nomUsuario,"email":usrObject.email,"uid":usrObject.uid,"org":nomOrg}});
                });
            });
        }
        if(uidNuevoUsuario!=""){
            admin.database().ref('proyectos/'+nomOrg+'/usuarios').set({
                uidNuevoUsuario : nameNuevoUsuario
            });
            listaUsuarios(decodedClaims.uid,res,{});

        }
        /*admin.auth().listUsers(1000).then(function(listUsers){
            var arrUsuarios = [];
            admin.database.ref('proyectos/')
            /*listUsers.users.forEach(function(userRecord){
                arrUsuarios.push({"displayName":userRecord.displayName,"email":userRecord.email});
            });*/
            /*
        }).catch(function(error){
            console.log("error obteniendo usuarios:"+error);
        });*/
        console.log(decodedClaims);
    }).catch(function(error) {
        console.log(error);
      // Force user to login.
      res.redirect('/');
    });
});

router.get('/ban/:uidusuario',function(req,res,next){

});

module.exports = router;