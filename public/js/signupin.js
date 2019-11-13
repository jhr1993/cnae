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
});

$(document).on('keyup keydown','.register-pw-input',function(){
    if($('#register-pw-input1').val()!=$('#register-pw-input2').val()){
        if($('.fa-unlock-alt').hasClass('register-pw-input-green')){
            $('.fa-unlock-alt').removeClass('register-pw-input-green');
            $('.fa-unlock-alt').addClass('register-pw-input-red');
            $('.fa-unlock-alt').removeClass('register-pw-input-green');
            $('.fa-unlock-alt').addClass('register-pw-input-red');
            $('#sign-in-up-content-input-pw-msg').slideDown()
        }
    }else {
        if($('.fa-unlock-alt').hasClass('register-pw-input-red')){
            $('.fa-unlock-alt').removeClass('register-pw-input-red');
            $('.fa-unlock-alt').addClass('register-pw-input-green');
            $('.fa-unlock-alt').removeClass('register-pw-input-red');
            $('.fa-unlock-alt').addClass('register-pw-input-green');
            $('#sign-in-up-content-input-pw-msg').slideUp()
        }
    }
});

$(document).on('focusin focusout', ".sign-in-up-content-input", function(e){
    console.log($(this).parent().parent());
    if(e.type == "focusin")
        $(this).parent().parent().find('.sign-in-up-content-input-msg').slideDown()
    else
        $(this).parent().parent().find('.sign-in-up-content-input-msg').slideUp()
});

$(document).on('mouseenter mouseleave', '.profile-img-menu1 i' ,function(e){
    $(this).parent().find('.profile-img-menu1-content').stop();
    $(this).parent().find('.profile-img-menu1-content').animate({width:'toggle'});
    if(e.type == 'mouseenter'){
        const color = $(this).css('color');
        $(this).css('color','white');
        $(this).css('background-color',color);
    }else {
        const color = $(this).css('background-color');
        $(this).css('color',color);
        $(this).css('background-color','white');
    }
});

$(document).ready(function(){
    $('.profile-about').height($('.profile-img').height()-30);
})

$('.profile-img-menu').resize(function(){
    console.log('working');
});