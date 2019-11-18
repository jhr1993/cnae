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
});

$(document).ready(function(){
    
    const id = $('.profile-id').attr('id');
    fetch(`/db/get_own_event/${id}`,{method: 'get'}).then((res)=>{
        return res.json()
    }).then((res)=>{
        const data = res.data;
        for(let i = 0; i<4; i++){
            if($('.profile-events-list').children().length-1 < data.length) {
                const dateSplit = data[i].date[0].split('T')[0];
                console.log(dateSplit)
                const date = (data[i].date.length>1) ? `${dateSplit}+${data[i].date.length-1}` : dateSplit
                $('.profile-events-list').append(`<li class="profile-list">
                    <a href="/event/${data[i]._id}">
                        <div class="profile-list-img-container">
                            <div class="profile-list-img-background" style="background: url(${data[i].title_img});background-size: cover;"></div>
                            <div class="profile-list-img" style="background: url(${data[i].title_img});background-size: contain;background-repeat: no-repeat;background-position: center;"></div>
                        </div>
                        <div class="profile-list-content">
                            <div class="profile-list-content-title">${data[i].title}</div>
                            <div class="profile-list-content-date">${date}</div>
                            <div class="profile-list-content-cost">PAID</div>
                        </div>
                    </a>
                </li>`)
            }
        }
        
        $('.profile-events-list').width(235 + (150 * ($('.profile-events-list').children().length-1)))
    })
})


let dragSlide = true;
$(document).ready(function(){
    $('.profile-events-list').draggable({ 
        axis: "x",
        stop: function(){
            const end = $('.profile-list-container').width() - $(this).width()
            $(this).finish();
            if($(this).position().left<end && $('.profile-events-list').width()>=$('.profile-list-container').width()){
                $(this).animate({left:end})
            }else if($(this).position().left<end)
                $(this).animate({left:0})
            if($(this).position().left>0)
                $(this).animate({left:0})
        },drag: function(){
            const end = $('.profile-list-container').width() - $(this).width()
            if(($(this).position().left<end) && dragSlide){
                const id = $('.profile-id').attr('id');
                dragSlide = false;
                fetch(`/db/get_own_event/${id}`,{method: 'get'}).then((res)=>{
                    return res.json()
                }).then((res)=>{
                    const data = res.data;
                    if($(this).children().length-1 < data.length) {
                        const data_start = $(this).children().length -1;
                        const dateSplit = data[data_start].date[0].split('T')[0];
                        console.log(dateSplit);
                        const date = (data[data_start].date.length>1) ? `${dateSplit}+${data[data_start].date.length-1}` : dateSplit
                        $(this).append(`<li class="profile-list">
                            <div class="profile-list-img-container">
                                <div class="profile-list-img-background" style="background: url(${data[data_start].title_img});background-size: cover;"></div>
                                <div class="profile-list-img" style="background: url(${data[data_start].title_img});background-size: contain;background-repeat: no-repeat;background-position: center;"></div>
                            </div>
                            <div class="profile-list-content">
                                <div class="profile-list-content-title">${data[data_start].title}</div>
                                <div class="profile-list-content-date">${date}</div>
                                <div class="profile-list-content-cost">PAID</div>
                            </div>
                        </li>`)
                        $(this).width(235 + (150 * ($('.profile-events-list').children().length-1)))
                        dragSlide = true;
                    }
                    
                })
            }
        }
    })
})
