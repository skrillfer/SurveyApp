function showInModal(strVal){
    $('#labelCopiado').css('display','none');
    $('#txtCompartirUrl').val(strVal);
    $('#modalCompartirUrl').modal('show');
}

$(document).ready(function(){
    $('#btnCopiarLink').click(function(e){
        $('#txtCompartirUrl').select();
        document.execCommand('copy');
        $('#labelCopiado').css('display','block');
    });
})