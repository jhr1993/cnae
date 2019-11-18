$(document).on('click','#event-add-category .event-add-content-button',function(){
    const container = $('#event-add-category .event-add-new');
    container.append(`
    <div class="event-add-content event-add-content-text">
        <i class="fa fa-close"></i>
        <input type="text" name="category[]" placeholder="Search Event Category">
        <div class="event-add-content-list-container">
            <ul class="event-add-content-list"></ul>
        </div>
        <div class="event-add-error">error</div>
    </div>
    `)
    if(container.children().length>1){
        container.find('.fa-close').show();
    }
});

$(document).on('click','#event-add-category .event-add-content .fa-close',function(){
    const container = $('#event-add-category .event-add-new');
    if(container.children().length>1){
        $(this).parent().remove()
        if(container.children().length<=1){
            container.find('.fa-close').hide();
        }
    }
});

$(document).ready(function(){
    if($('#event-add-category .event-add-new').children().length>1){
        $('##event-add-category').find('.fa-close').show();
    }
})

$(document).on('keyup focuson','#event-add-category input',function(){
    const title = $(this).val();
    console.log(title);
    fetch(`/db/get_categories/${title}`,{method:'get'}).then((res)=>{
        return res.json();
    }).then((res)=>{
        $(this).parent().find('.event-add-content-list-container').show();
        const data = res.data;
        let list = '';
        for(let i = 0; i < data.length; i++) {
            list += `<li id="${data[i].origin._id}">
                <div class="event-add-content-list-parent">${data[i].parent}</div>
                <div class="event-add-content-list-title">${data[i].origin.title}</div>
            </li>`;
        }
        console.log(list);
        $(this).parent().find('.event-add-content-list').html(list)
    })
})

$(document).on('focusout','#event-add-category input',function(){
    $(this).parent().find('.event-add-content-list-container').hide();
    $(this).parent().find('.event-add-content-list').html('');
})