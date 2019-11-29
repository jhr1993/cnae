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

$(document).on('keyup focusin keydown','#event-category .event-add-content-category-title',function(e){
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

$(document).on('click','#event-category .event-add-content-search-container li', function(){
    const id = $(this).attr('id');
    const title = $(this).find('.event-add-content-category-search-title').html();
    const parent = $(this).find('.event-add-content-category-search-parent').html();
    $(this).parent().parent().parent().find('.event-add-content-category-parent').html(parent);
    $(this).parent().parent().parent().find('.event-add-content-category-title').val(title);
    $(this).parent().parent().parent().find('.event-add-content-category-id').val(id);
    $(this).parent().parent().hide()
    $(this).parent().html('')
})

/*$(document).on('focusout','#event-category .event-add-content-category-title',function(){
    $(this).parent().parent().find('.event-add-content-search-container').hide();
    $(this).parent().parent().find('.event-add-content-search').html('');
})*/

$(document).on('keyup focusin keydown','#event-artist .event-add-content-artist-name',function(e){
    if(e.type == 'keyup' || e.type == 'focusin'){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(()=>{
            const value = $(this).val();
            fetch(`/db/get_users/${value}`,{method:'get'}).then((res)=>{
                return res.json();
            }).then((res)=>{
                console.log(res.data);
                $(this).parent().parent().find('.event-add-content-search-container').show();
                const data = res.data;
                let list = '';
                for(let i = 0; i < data.length; i++) {
                    list += `<li id="${data[i]._id}">
                        <div class="event-add-content-artist-search-name">${data[i].name}</div>
                    </li>`;
                }
                $(this).parent().parent().find('.event-add-content-search').html(list)
            })
        }, 2000)
    } else {
        clearTimeout(typingTimer);
    }
})

$(document).on('click','#event-artist .event-add-content-search-container li', function(){
    const id = $(this).attr('id');
    const title = $(this).find('.event-add-content-artist-search-name').html();
    $(this).parent().parent().parent().find('.event-add-content-artist-name').val(title);
    $(this).parent().parent().parent().find('.event-add-content-artist-id').val(id);
    $(this).parent().parent().hide()
    $(this).parent().html('')
})

/*$(document).on('focusout','#event-artist .event-add-content-artist-name',function(){
    $(this).parent().parent().find('.event-add-content-search-container').hide();
    $(this).parent().parent().find('.event-add-content-search').html('');
})*/

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
})

$(document).on('click','.event-add-content-button',function(){ 
    const container = $(this).parent().find('.event-add-new');
    const cloneString = $(this).parent().find('.event-add-content:first');
    const test = cloneString.clone();
    test.find('.event-add-content-category-parent').html('');
    test.find('input').val('');
    test.find('textarea.event-add-content-textarea-message').val('');
    test.find('.event-add-error').html('');
    test.find('.event-add-error').hide();
    test.appendTo(container);
    if(container.children().length>1){
        container.find('.fa-close').show();
    }
});

$(document).on('click','#event-date-button',function(){ 
    console.log('work')
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
    });
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
    const value = $('#event-add-ticket input:checked').val();
    switch(value){
        case 'paid':
            $('#event-add-ticket .event-add-content-button').show();
            $('#event-add-ticket .event-add-new').show();
            $('#event-add-ticket .event-add-content-ticket-price-container').show();
            $('#event-add-ticket .event-add-new input').prop("disabled",false);
            break;
        case 'free':
            $('#event-add-ticket .event-add-content-button').show();
            $('#event-add-ticket .event-add-new').show();
            $('#event-add-ticket .event-add-content-ticket-price-container').hide();
            $('#event-add-ticket .event-add-new input').prop("disabled",false);
            break;
        default:
            $('#event-add-ticket .event-add-content-button').hide()
            $('#event-add-ticket .event-add-new').hide();
            $('#event-add-ticket .event-add-content-ticket-price-container').hide();
            $('#event-add-ticket .event-add-new input').prop("disabled",true);
            break;

    }
})

$(document).ready(function(){
    $('.textarea-editor').summernote();
})

$(document).on('click','.event-add-submit',function(e){
    let submit = true;
    e.preventDefault();
    if($('#event-title input').val()=='' || $('#event-title input').val()==' '){
        if(!$('#event-title input').hasClass('event-add-error-active')){
            $('#event-title input').addClass('event-add-error-active');
            errorDisplay($('#event-title'),'[WARNING] Title must not be empty')
            submit = false;
        }
    }
    if($('#event-summary textarea').val()=='' || $('#event-summary textarea').val()==' '){
        if(!$('#event-summary textarea').hasClass('event-add-error-active')){
            $('#event-summary textarea').addClass('event-add-error-active');
            errorDisplay($('#event-summary'),'[WARNING] Summary must not be empty')
            submit = false;
        }
    }
    if($('#event-desc textarea').val()=='' || $('#event-desc textarea').val()==' '){
        if(!$('#event-desc .note-frame').hasClass('event-add-error-active')){
            $('#event-desc .note-frame').addClass('event-add-error-active');
            errorDisplay($('#event-desc'),'[WARNING] Description must not be empty')
            submit = false;
        }
    }

    let categories = $("#event-category").children();
    for(let i = 0;i < categories.length; i++) {
        if($(categories[i]).find('.event-add-content-category-title').val()=='' || $(categories[i]).find('.event-add-content-category-title').val()==' '){
            if(!$(categories[i]).find('.event-add-content-category-title').hasClass('event-add-error-active')){
                $(categories[i]).find('.event-add-content-category-title').addClass('event-add-error-active');
            }
            errorDisplay($(categories[i]),'[WARNING] Category must not be empty')
            submit = false;
        }
        if($(categories[i]).find('.event-add-content-category-id').val()=='' || $(categories[i]).find('.event-add-content-category-id').val()==' '){
            if(!$(categories[i]).find('.event-add-content-category-id').hasClass('event-add-error-active')){
                $(categories[i]).find('.event-add-content-category-id').addClass('event-add-error-active');
            }
            errorDisplay($(categories[i]),'[WARNING] Category must be selected')
            submit = false;
        }
    }

    let dates = $("#event-date").children();
    for(let i = 0;i < dates.length; i++) {
        if($(dates[i]).find('.start-calendar').val()=='' || $(dates[i]).find('start-calendar').val()==' '){
            if(!$(dates[i]).find('.start-calendar').hasClass('event-add-error-active')){
                $(dates[i]).find('.start-calendar').addClass('event-add-error-active');
            }
            errorDisplay($(dates[i]),'[WARNING] Start date required input must not be empty')
            submit = false;
        }
        if($(dates[i]).find('.end-calendar').val()=='' || $(dates[i]).find('end-calendar').val()==' '){
            if(!$(dates[i]).find('.end-calendar').hasClass('event-add-error-active')){
                $(dates[i]).find('.end-calendar').addClass('event-add-error-active');
            }
            errorDisplay($(dates[i]),'[WARNING] End date required input must not be empty')
            submit = false;
        }
        if($(dates[i]).find('.start-time').val()=='' || $(dates[i]).find('start-time').val()==' '){
            if(!$(dates[i]).find('.start-time').hasClass('event-add-error-active')){
                $(dates[i]).find('.start-time').addClass('event-add-error-active');
            }
            errorDisplay($(dates[i]),'[WARNING] Start time required input must not be empty')
            submit = false;
        }
        if($(dates[i]).find('.end-time').val()=='' || $(dates[i]).find('end-time').val()==' '){
            if(!$(dates[i]).find('.end-time').hasClass('event-add-error-active')){
                $(dates[i]).find('.end-time').addClass('event-add-error-active');
            }
            errorDisplay($(dates[i]),'[WARNING] End time required input must not be empty')
            submit = false;
        }
    }

    let artists = $("#event-artist").children();
    for(let i = 0;i < artists.length; i++) {
        if($(artists[i]).find('.event-add-content-artist-name').val()=='' || $(categories[i]).find('.event-add-content-artist-name').val()==' '){
            if(!$(artists[i]).find('.event-add-content-artist-name').hasClass('event-add-error-active')){
                $(artists[i]).find('.event-add-content-artist-name').addClass('event-add-error-active');
            }
            errorDisplay($(artists[i]),'[WARNING] Artists must not be empty')
            submit = false;
        }
        if($(artists[i]).find('.event-add-content-artist-id').val()=='' || $(artists[i]).find('.event-add-content-artist-id').val()==' '){
            if(!$(artists[i]).find('.event-add-content-artist-id').hasClass('event-add-error-active')){
                $(artists[i]).find('.event-add-content-artist-id').addClass('event-add-error-active');
            }
            errorDisplay($(artists[i]),'[WARNING] Artists must be selected')
            submit = false;
        }
    }

    let tickets = $("#event-add-ticket .event-add-new").children();
    if($('#event-add-ticket input:checked').val() == 'paid'){
        for(let i = 0;i < tickets.length; i++) {
            if($(tickets[i]).find('.event-add-content-ticket-type').val()=='' || $(tickets[i]).find('.event-add-content-ticket-type').val()==' '){
                if(!$(tickets[i]).find('.event-add-content-ticket-type').hasClass('event-add-error-active')){
                    $(tickets[i]).find('.event-add-content-ticket-type').addClass('event-add-error-active');
                    errorDisplay($(tickets[i]),'[WARNING] Ticekt type must not be empty')
                }
                submit = false;
            }
            if($(tickets[i]).find('.event-add-content-ticket-currency').val()=='' || $(tickets[i]).find('.event-add-content-ticket-currency').val()==' '){
                if(!$(tickets[i]).find('.event-add-content-ticket-currency').hasClass('event-add-error-active')){
                    $(tickets[i]).find('.event-add-content-ticket-currency').addClass('event-add-error-active');
                    errorDisplay($(tickets[i]),'[WARNING] Ticekt currency must not be empty')
                }
                submit = false;
            }
            if($(tickets[i]).find('.event-add-content-ticket-price').val()=='' || $(tickets[i]).find('.event-add-content-ticket-price').val()==' '){
                if(!$(tickets[i]).find('.event-add-content-ticket-price').hasClass('event-add-error-active')){
                    $(tickets[i]).find('.event-add-content-ticket-price').addClass('event-add-error-active');
                    errorDisplay($(tickets[i]),'[WARNING] Ticekt price must not be empty')
                }
                submit = false;
            }
            if($(tickets[i]).find('.event-add-content-ticket-capacity').val()=='' || $(tickets[i]).find('.event-add-content-ticket-capacity').val()==' '){
                if(!$(tickets[i]).find('.event-add-content-ticket-capacity').hasClass('event-add-error-active')){
                    $(tickets[i]).find('.event-add-content-ticket-capacity').addClass('event-add-error-active');
                    errorDisplay($(tickets[i]),'[WARNING] Ticekt capacity must not be empty')
                }
                submit = false;
            }
        }
    }else if($('#event-add-ticket input:checked').val() == 'free'){
        for(let i = 0;i < tickets.length; i++) {
            if($(tickets[i]).find('.event-add-content-ticket-type').val()=='' || $(tickets[i]).find('.event-add-content-ticket-type').val()==' '){
                if(!$(tickets[i]).find('.event-add-content-ticket-type').hasClass('event-add-error-active')){
                    $(tickets[i]).find('.event-add-content-ticket-type').addClass('event-add-error-active');
                    errorDisplay($(tickets[i]),'[WARNING] Ticekt type must not be empty')
                }
                submit = false;
            }
            if($(tickets[i]).find('.event-add-content-ticket-capacity').val()=='' || $(tickets[i]).find('.event-add-content-ticket-capacity').val()==' '){
                if(!$(tickets[i]).find('.event-add-content-ticket-capacity').hasClass('event-add-error-active')){
                    $(tickets[i]).find('.event-add-content-ticket-capacity').addClass('event-add-error-active');
                    errorDisplay($(tickets[i]),'[WARNING] Ticekt capacity must not be empty')
                }
                submit = false;
            }
        }
    }

    let contacts = $("#event-add-contact .event-add-new").children();
    for(let i = 0;i < contacts.length; i++) {
        if($(contacts[i]).find('.event-add-content-contact-name').val()=='' || $(tickets[i]).find('.event-add-content-contact-name').val()==' '){
            if(!$(contacts[i]).find('.event-add-content-contact-name').hasClass('event-add-error-active')){
                $(contacts[i]).find('.event-add-content-contact-name').addClass('event-add-error-active');
                errorDisplay($(contacts[i]),'[WARNING] Name must not be empty')
            }
            submit = false;
        }
        if($(contacts[i]).find('.event-add-content-contact-phone').val()=='' || $(tickets[i]).find('.event-add-content-contact-phone').val()==' '){
            if(!$(contacts[i]).find('.event-add-content-contact-phone').hasClass('event-add-error-active')){
                $(contacts[i]).find('.event-add-content-contact-phone').addClass('event-add-error-active');
                errorDisplay($(contacts[i]),'[WARNING]  Phone must not be empty')
            }
            submit = false;
        }
        if($(contacts[i]).find('.event-add-content-contact-email').val()=='' || $(tickets[i]).find('.event-add-content-ticket-email').val()==' '){
            if(!$(contacts[i]).find('.event-add-content-contact-email').hasClass('event-add-error-active')){
                $(contacts[i]).find('.event-add-content-contact-email').addClass('event-add-error-active');
                errorDisplay($(contacts[i]),'[WARNING] Email must not be empty')
            }
            submit = false;
        }
    }
    if(submit)
        $('.event-add-form').submit();
})

function errorDisplay(element, bool, msg = "[WARNING] We got some problems I guess..."){
    if(bool){
        element.find('.event-add-error').show();
        element.find('.event-add-error').html(msg);
    }else{
        element.find('.event-add-error').hide();
        element.find('.event-add-error').html('');
    }
    window.scrollTo(0,element.offset().top-88)
}

var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('event-add-content-place-map1'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    /* Map function customise */
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    
    var searchMarkers=[];
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        searchMarkers.forEach(function(searchMarkers) {
            searchMarkers.setMap(null);
        });
        searchMarkers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            searchMarkers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
            const address = place.address_components;
            const addressOutput = {};
            let locality = false;
            console.log(address);
            for(let i = 0; i < address.length; i++){
                if(address[i].types.includes('locality')){
                    addressOutput.city = address[i].long_name;
                    locality = true;
                }
                if(address[i].types.includes('postal_code'))
                    addressOutput.postal_code = address[i].long_name;
                if(address[i].types.includes('country'))
                    addressOutput.country = address[i].long_name;
                if(address[i].types.includes('administrative_area_level_1'))
                    addressOutput.state = address[i].long_name;
                if(address[i].types.includes('administrative_area_level_2'))
                    addressOutput.province = address[i].long_name;
            }
            console.log(addressOutput);
            $(input).parent().find('.place-state').val(addressOutput.state);
            $(input).parent().find('.place-zip').val(addressOutput.postal_code);
            $(input).parent().find('.place-state').val(addressOutput.state);
            $(input).parent().find('.place-city').val(addressOutput.city);
            $(input).parent().find('.place-country').val(addressOutput.country);
        });
        map.fitBounds(bounds);
    });
}