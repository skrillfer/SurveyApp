var survey;
//Funciones para el editor
function guardarEncuesta(){
    $('#selOrganizaciones').find('option').remove();
    var listOrgs = globalUserObject['organizaciones'];
    for(var i=0;i<listOrgs.length;i++){
        var objOrg = listOrgs[i];
        var selected='';
        if((objOrg.key==glbOrganizacion)&&(glbOrganizacion!='')){
            selected='selected="selected"';
        }
        $('#selOrganizaciones').append('<option value="'+objOrg.key+'" '+selected+'>'+objOrg.child('nombre').val()+'</option>');
    }
    $('#modalGuardar').modal();
}

function guardarEncuestaFirebase(){
    var organizacion = $('#selOrganizaciones').val();
    var fecha = new Date();
    var id = glbIdEncuesta;
    if(id==''){
        fecha.getFullYear()+fecha.getMonth()+fecha.getDay()+'_'+fecha.getHours()+fecha.getMinutes();
    }
    database.ref('/proyectos/'+organizacion+'/encuestas/'+id).set({
        "nombre":$('#nomEncuesta').val(),
        "encuesta":survey.text
    }).then(function(){
        window.location.href='/dashboard/overview';
    });
}


$(document).ready(function(){
    var editorOptions = {showEmbededSurveyTab: true,showJSONEditorTab:false,showEmbededSurveyTab:false,locale:'es'}; //see examples below
    SurveyEditor.editorLocalization.currentLocale='es';
    survey = new SurveyEditor.SurveyEditor("surveyEditorContainer", editorOptions);
    survey.locale = 'es';
    //set function on save callback
    survey.saveSurveyFunc = guardarEncuesta;

    if(glbEncuestaJSON !=""){
        survey.text = glbEncuestaJSON;
    }

    $('#btnGuardarEncuesta').click(function(){
        guardarEncuestaFirebase();
    });
    $('body').addClass('brand-minimized');
    $('body').addClass('sidebar-minimized');
});
