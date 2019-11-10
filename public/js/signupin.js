$(document).on('click','.sign-in-up-content-input-container .eye-icon',function(){
    if($('.register-pw-input').hasClass('fa-eye')) {
        $('.register-pw-input').removeClass('fa-eye');
        $('.register-pw-input').addClass('fa-eye-slash');
        $('.register-pw-input').parent().find('input').attr('type','password');
    } else {
        $('.register-pw-input').removeClass('fa-eye-slash')
        $('.register-pw-input').addClass('fa-eye')
        $('.register-pw-input').parent().find('input').attr('type','text');
    }
})

$(document).on('keyup keydown','.register-pw-input',function(){
    if($('#register-pw-input1').val()!=$('#register-pw-input2').val()){
        if($(this).parent().find('.fa-unlock-alt').hasClass('register-pw-input-green')){
            $('#register-pw-input1').parent().find('.fa-unlock-alt').removeClass('register-pw-input-green');
            $('#register-pw-input1').parent().find('.fa-unlock-alt').addClass('register-pw-input-red');
            $('#register-pw-input2').parent().find('.fa-unlock-alt').removeClass('register-pw-input-green');
            $('#register-pw-input2').parent().find('.fa-unlock-alt').addClass('register-pw-input-red');
            $('#sign-in-up-content-input-pw-msg').slideDown()
        }
    }else {
        if($(this).parent().find('.fa-unlock-alt').hasClass('register-pw-input-red')){
            $('#register-pw-input1').parent().find('.fa-unlock-alt').removeClass('register-pw-input-red');
            $('#register-pw-input1').parent().find('.fa-unlock-alt').addClass('register-pw-input-green');
            $('#register-pw-input2').parent().find('.fa-unlock-alt').removeClass('register-pw-input-red');
            $('#register-pw-input2').parent().find('.fa-unlock-alt').addClass('register-pw-input-green');
            $('#sign-in-up-content-input-pw-msg').slideUp()
        }
    }
})

$(document).on('focusin focusout', ".sign-in-up-content-input", function(e){
    console.log($(this).parent().parent());
    if(e.type == "focusin")
        $(this).parent().parent().find('.sign-in-up-content-input-msg').slideDown()
    else
        $(this).parent().parent().find('.sign-in-up-content-input-msg').slideUp()
})