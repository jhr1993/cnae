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
    $(this).parent().find('.profile-img-menu-content').stop();
    $(this).parent().find('.profile-img-menu-content').animate({width:'toggle'});
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
    let width = 235 + (150 * ($('.profile-events-list').children().length-1))
    $('.profile-events-list').width(width)
})

const testdata = [
    {img:'/img/sampleImage/img6.jpg',title:'This is test event1',date:['01 11 2019','05 11 2019','06 11 2019'],price:[{currency:"KRW",price:500}]},
    {img:'/img/sampleImage/img7.png',title:'This is test event2',date:['03 11 2019','05 11 2019','06 11 2019'],price:false},
    {img:'/img/sampleImage/img9.jpg',title:'This is test event2',date:['03 12 2019','03 12 2019','03 10 2019'],price:false},
    {img:'/img/sampleImage/img9.jpg',title:'This is test event2',date:['03 12 2019','03 12 2019','03 10 2019'],price:false},
    {img:'/img/sampleImage/img6.jpg',title:'This is test event1',date:['01 11 2019','05 11 2019','06 11 2019'],price:[{currency:"KRW",price:500}]},
    {img:'/img/sampleImage/img7.png',title:'This is test event2',date:['03 11 2019','05 11 2019','06 11 2019'],price:false},
    {img:'/img/sampleImage/img9.jpg',title:'This is test event2',date:['03 12 2019','03 12 2019','03 10 2019'],price:false}
]

$(document).ready(function(){
    $('.profile-events-list').draggable({ 
        axis: "x",
        stop: function(){
            const end = $('.profile-list-container').width() - $(this).width()
            $(this).finish();
            if($(this).position().left<end){
                console.log(end);
                $(this).animate({left:end})
            }
            if($(this).position().left>0)
                $(this).animate({left:0})
        },drag: function(){
            const end = $('.profile-list-container').width() - $(this).width()
            if($(this).position().left<end){
                fetch(`/db/get_own_event/${id}`,{method: 'get'}).then((res)=>{
                    return res.json()
                }).then((res)=>{
                    
                    const data = res.data;
                    if($(this).children().length-1 < data.length) {
                        const data_start = $(this).children().length -1;
                        
                        console.log(data_start);
                        const date = (data[data_start].date.length>1) ? data[data_start].date[0]+'+' : data[data_start].date[0]
                        $(this).append(`<li class="profile-list">
                            <div class="profile-list-img-container">
                                <div class="profile-list-img-background" style="background: url(${data[data_start].img});background-size: cover;"></div>
                                <div class="profile-list-img" style="background: url(${data[data_start].img});background-size: contain;background-repeat: no-repeat;background-position: center;"></div>
                            </div>
                            <div class="profile-list-content">
                                <div class="profile-list-content-title">${data[data_start].title}</div>
                                <div class="profile-list-content-date">${date}</div>
                                <div class="profile-list-content-cost">PAID</div>
                            </div>
                        </li>`)
                        $(this).width(235 + (150 * ($('.profile-events-list').children().length-1)))
                    }
                    
                })
            }
        }
    })
})
