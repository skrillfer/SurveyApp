var survey;
//Funciones para el editor
function guardarEncuesta(){
    var listOrgs = globalUserObject['organizaciones'];
    for(var i=0;i<listOrgs.length;i++){
        var objOrg = listOrgs[i];
        $('#selOrganizaciones').append('<option value="'+objOrg.key+'">'+objOrg.child('nombre').val()+'</option>');
    }
    $('#modalGuardar').modal();
}

function guardarEncuestaFirebase(){
    var organizacion = $('#selOrganizaciones').val();
    var fecha = new Date();
    var id = fecha.getFullYear()+fecha.getMonth()+fecha.getDay()+'_'+fecha.getHours()+fecha.getMinutes();
    database.ref('/proyectos/'+organizacion+'/encuestas/'+id).set({
        "nombre":$('#nomEncuesta').val(),
        "encuesta":survey.text
    });
}


$(document).ready(function(){
    var editorOptions = {showEmbededSurveyTab: true}; //see examples below
    survey = new SurveyEditor.SurveyEditor("surveyEditorContainer", editorOptions);
    //set function on save callback
    survey.saveSurveyFunc = guardarEncuesta;

    $('#btnGuardarEncuesta').click(function(){
        guardarEncuestaFirebase();
    });
});
