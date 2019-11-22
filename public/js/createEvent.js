/*$(document).on('click','#event-add-category .event-add-content-button',function(){
    const container = $('#event-add-category .event-add-new');
    container.append(`
    <div class="event-add-content event-add-content-text">
        <i class="fa fa-close"></i>
        <div class="event-add-content-category-parent"></div>
        <input type="text" class="event-add-content-category-title" name="category[]" placeholder="Search Event Category"> 
        <input type="hidden" class="event-add-content-category-id" name="categoryId[]">
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
                <div class="event-add-content-category-list-parent">${data[i].parent}</div>
                <div class="event-add-content-category-list-title">${data[i].origin.title}</div>
            </li>`;
        }
        console.log(list);
        $(this).parent().find('.event-add-content-list').html(list)
    })
})

$(document).on('focusout','#event-add-category input',function(){
    $(this).parent().find('.event-add-content-category-list-container').hide();
    $(this).parent().find('.event-add-content-category-list').html('');
})

$(document).on('click','.event-add-content-list-container li', function(){
    const id = $(this).attr('id');
    const title = $(this).find('.event-add-content-category-list-title').html();
    const parent = $(this).find('.event-add-content-category-list-parent').html();
    $(this).parent().parent().parent().find('.event-add-content-category-parent').html(parent);
    $(this).parent().parent().parent().find('.event-add-content-category-title').val(title);
    $(this).parent().parent().parent().find('.event-add-content-category-id').val(id);
    $(this).parent().parent().hide()
    $(this).parent().html('')
})

$(document).ready(function(){
    $( function() {
        var dateFormat = "mm/dd/yy",
        from = $( ".start-calendar" )
        .datepicker({
            defaultDate: "+1w",
            nextText: "&gt;",
            prevText: "&lt;"
        })
        .on( "change", function() {
            to.datepicker( "option", "minDate", getDate( this ) );
        }),
            to = $( ".end-calendar" ).datepicker({
            defaultDate: "+1w",
            nextText: "&gt;",
            prevText: "&lt;"
        })
        .on( "change", function() {
            from.datepicker( "option", "maxDate", getDate( this ) );
        });

        function getDate( element ) {
            var date;
            try {
                date = $.datepicker.parseDate( dateFormat, element.value );
            } catch( error ) {
                date = null;
            }

            return date;
        }
    } );
})*/

$(document).on('click','.event-add-content-button',function(){ 
    const container = $(this).parent().find('.event-add-new');
    const cloneString = $(this).parent().find('.event-add-content:first');
    const test = cloneString.clone();
    test.find('input').val('');
    test.find('textarea.event-add-content-textarea-message').val('');
    test.appendTo(container);
    if(container.children().length>1){
        container.find('.fa-close').show();
    }
});

$(document).on('click','.fa-close',function(){
    const container = $(this).parent().parent();
    if(container.children().length>1){
        $(this).parent().remove();
    }
    if(container.children().length<=1){
        container.find('.fa-close').hide();
    }
});

$(document).on('change','.event-add-content-title-image',function(e){
    output = $(this).parent().find('.event-add-content-title-image-preview');
    output.css('background',`url(${URL.createObjectURL(e.target.files[0])})`);
    output.css('background-size','contain');
    output.css('background-position','center');
    output.css('background-repeat','no-repeat');
})

$(document).on('change','#event-add-ticket .event-add-content-radio',function(){
    const value = $('input:checked').val();
    console.log(value)
    switch(value){
        case 'paid':
            $('#event-add-ticket .event-add-content-button').show();
            $('#event-add-ticket .event-add-new').show();
            $('#event-add-ticket .event-add-content-ticket-price').show();
            $('#event-add-ticket .event-add-new input').prop("disabled",false);
            break;
        case 'free':
            $('#event-add-ticket .event-add-content-button').show();
            $('#event-add-ticket .event-add-new').show();
            $('#event-add-ticket .event-add-content-ticket-price').hide();
            $('#event-add-ticket .event-add-new input').prop("disabled",false);
            break;
        default:
            $('#event-add-ticket .event-add-content-button').hide()
            $('#event-add-ticket .event-add-new').hide();
            $('#event-add-ticket .event-add-content-ticket-price').hide();
            $('#event-add-ticket .event-add-new input').prop("disabled",true);
            break;

    }
})