$(document).on('click','#event-add-category .event-add-content-button',function(){
    const container = $('#event-add-category .event-add-new');
    container.append(`
    <div class="event-add-content event-add-content-text">
        <i class="fa fa-close"></i>
        <input type="text" name="category[]" placeholder="Search Event Category">
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