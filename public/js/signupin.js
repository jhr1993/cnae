$(document).on('click','.sign-in-up-content-input-container .eye-icon',function(){
    if($(this).hasClass('fa-eye')) {
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
        $(this).parent().find('input').attr('type','password');
    } else {
        $(this).removeClass('fa-eye-slash')
        $(this).addClass('fa-eye')
        $(this).parent().find('input').attr('type','text');
    }
})

$(document).on('keyup keydown','')