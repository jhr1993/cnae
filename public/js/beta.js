$(document).on('click','.event-add-form-submit',function(e){
    let all_clear = true;
    e.preventDefault();
    $('.event-add-required .event-add-sub-content-input').val(function(i, origValue){
        if(origValue == '' || origValue == ' '){
            $(this).parent().parent().find('.alert-msg-error-type-empty').show();
            $(this).parent().addClass('alert-msg-active-error');
            all_clear = false;
        }else{
            $(this).parent().parent().find('.alert-msg-error-type-empty').hide();
            $(this).parent().removeClass('alert-msg-active-error');
        }
        return origValue;
    });
    if(all_clear)
        $('.event-add-form').submit();
});

$(document).on('keyup keydown change','.event-add-required .event-add-sub-content-input',function(){
    if($(this).val() != '' || $(this).val() !=' '){
        $(this).parent().parent().find('.alert-msg-error-type-empty').hide();
        $(this).parent().removeClass('alert-msg-active-error');
    }
});

$(document).on('click','.event-add-addable .event-add-sub-sector-content-button',function(){ 
    const container = $(this).parent().find('.event-add-content-container');
    const cloneString = container.find('.event-add-content:first');
    const clone = cloneString.clone();
    clone.find('.event-add-content-input-top').html('');
    clone.find('.event-add-sub-content-input').val('');
    clone.find('.event-add-sub-content-input').html('');
    clone.find('.event-add-sub-content-search-ul').html('');
    clone.find('.event-add-image-preview-list').html('');
    clone.find('.alert-msg-error').hide();
    clone.find('.event-add-sub-content-input-container').removeClass('alert-msg-active-error');
    clone.appendTo(container);
    if(container.children().length>1){
        container.find('.fa-close').show();
    }
});

$(document).ready(function(){
    container = $('.event-add-addable event-add-addable-content');
    if(container.children().length > 1){
        container.find('.fa-close').show();
    }
})

$(document).on('click','.event-add-addable .fa-close',function(){ 
    container = $(this).parent().parent();
    if(container.children().length > 1){
        if (confirm('Are you sure you want to remove this?')) {
            $(this).parent().remove();
        }
    }
    if(container.children().length <= 1){
        container.find('.fa-close').hide();
    }
});

$(document).on('keyup focusin keydown', '.event-add-searchable-content .event-add-sector-sub-content-input',function(){

})

$(document).on('change','.event-add-input-text-input-img',function(e){
    const container = $(this).parent().parent().parent().find('.event-add-image-preview-list')
    let eleContainer = document.createElement("div");
    $(eleContainer).addClass('event-add-image-preview-container');
    let img = $(this).clone().attr('name','')
    img.appendTo(eleContainer);
    const content = `<div class="fa fa-close"></div>
    <div class="event-add-image-preview" style="background:url(${URL.createObjectURL(e.target.files[0])}) center/contain no-repeat !important"></div>
    <div class="event-add-image-preview-desc">
        <div class="event-add-image-preview-name">
            <div class="event-add-image-preview-title">File Name</div>
            <div class="event-add-image-preview-content">${e.target.files[0].name}</div>
        </div>
        <div class="event-add-image-preview-size">
            <div class="event-add-image-preview-title">File Size</div>
            <div class="event-add-image-preview-content">${e.target.files[0].size} B</div>
        </div>
    </div>
    <div class="float-clear-both"></div>`
    $(content).appendTo(eleContainer);
    if(container.hasClass('image-single'))
        container.html(eleContainer);
    else
        container.append(eleContainer);
})

$(document).on('click','.event-add-image-preview-container .fa-close', function(){
    if (confirm('Are you sure you want to remove this?')) {
        $(this).parent().remove();
    }
})

