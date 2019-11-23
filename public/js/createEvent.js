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
})*/

let typingTimer

$(document).on('keyup focusin keydown','#event-add-category .event-add-content-category-title',function(e){
    if(e.type == 'keyup' || e.type == 'focusin'){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(()=>{
            const title = $(this).val();
            fetch(`/db/get_categories/${title}`,{method:'get'}).then((res)=>{
                return res.json();
            }).then((res)=>{
                $(this).parent().parent().find('.event-add-content-search-container').show();
                const data = res.data;
                let list = '';
                for(let i = 0; i < data.length; i++) {
                    list += `<li id="${data[i].origin._id}">
                        <div class="event-add-content-category-search-parent">${data[i].parent}</div>
                        <div class="event-add-content-category-search-title">${data[i].origin.title}</div>
                    </li>`;
                }
                $(this).parent().parent().find('.event-add-content-search').html(list)
            })
        }, 2000)
    } else {
        clearTimeout(typingTimer);
    }
})

$(document).on('click','.event-add-content-search-container li', function(){
    const id = $(this).attr('id');
    const title = $(this).find('.event-add-content-category-search-title').html();
    const parent = $(this).find('.event-add-content-category-search-parent').html();
    console.log(`${id} ${title} ${parent}`)
    $(this).parent().parent().parent().find('.event-add-content-category-parent').html(parent);
    $(this).parent().parent().parent().find('.event-add-content-category-title').val(title);
    $(this).parent().parent().parent().find('.event-add-content-category-id').val(id);
    $(this).parent().parent().hide()
    $(this).parent().html('')
})

$(document).on('focusout','#event-add-category .event-add-content-category-title',function(){
    $(this).parent().parent().find('.event-add-content-search-container').hide();
    $(this).parent().parent().find('.event-add-content-search').html('');
})

/*$(document).ready(function(){
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
    test.find('.event-add-content-category-parent').html('');
    console.log(test.find('.event-add-content-category-parent').html());
    test.find('input').val('');
    console.log(test.find('input').val())
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
    output = $(this).parent().parent().parent().find('.event-add-content-title-image-preview');
    output.css('background',`url(${URL.createObjectURL(e.target.files[0])})`);
    $(this).parent().parent().parent().find('.event-add-content-title-image-preview-name').find('.event-add-content-title-image-preview-content').text(e.target.files[0].name);
    $(this).parent().parent().parent().find('.event-add-content-title-image-preview-size').find('.event-add-content-title-image-preview-content').text(`${e.target.files[0].size}B`);
    $(this).parent().parent().parent().find('.event-add-content-title-image-preview-desc').show()
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

$(document).ready(function(){
    $('.textarea-editor').summernote({
        toolbar: [
          // [groupName, [list of button]]
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['font', ['strikethrough', 'superscript', 'subscript']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['misc', ['fullscreen','undo','redo']]
        ]
    });
})