$(document).on('click','.event-add-form-submit',function(e){
    let all_clear = true;
    e.preventDefault();
    $('.event-add-required .event-add-sector-sub-content-input').val(function(i, origValue){
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

$(document).on('keyup keydown change','.event-add-required .event-add-sector-sub-content-input',function(){
    if($(this).val() != '' || $(this).val() !=' '){
        $(this).parent().parent().find('.alert-msg-error-type-empty').hide();
        $(this).parent().removeClass('alert-msg-active-error');
    }
});

$(document).on('click','.event-add-addable .event-add-sector-sub-content-button',function(){ 
    const container = $(this).parent().find('.event-add-sector-sub-content-container');
    const cloneString = container.find('.event-add-sector-sub-content:first');
    const clone = cloneString.clone();
    clone.find('.event-add-content-category-parent').html('');
    clone.find('.event-add-sector-sub-content-input').val('');
    clone.find('.event-add-sector-sub-content-input').html('');
    clone.find('.event-add-sector-sub-content-search-ul').html('');
    clone.find('.alert-msg-error').hide();
    clone.find('.event-add-sector-sub-content-input-container').removeClass('alert-msg-active-error');
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
    container = $(this).parent().parent().parent();
    if(container.children().length > 1){
        if (confirm('Are you sure you want to remove this?')) {
            $(this).parent().parent().remove();
        }
    }
    if(container.children().length <= 1){
        container.find('.fa-close').hide();
    }
});

$(document).on('keyup focusin keydown', '.event-add-searchable-content .event-add-sector-sub-content-input',function(){

})

/*$(document).on('change','.event-add-input-text-input-img',function(e){
    output = $(this).parent().parent().parent().find('.event-add-title-image-preview');
    output.css('background',`url(${URL.createObjectURL(e.target.files[0])})`);
    $(this).parent().parent().parent().find('.event-add-title-image-preview-name').find('.event-add-title-image-preview-content').text(e.target.files[0].name);
    $(this).parent().parent().parent().find('.event-add-title-image-preview-size').find('.event-add-title-image-preview-content').text(`${e.target.files[0].size} B`);
    $(this).parent().parent().parent().find('.event-add-title-image-preview-desc').show()
    output.css('background-size','contain');
    output.css('background-position','center');
    output.css('background-repeat','no-repeat');
    console.log($(this).val());
})*/

$(document).on('change','.event-add-input-text-input-img',function(e){
    let container = document.createElement("div");
    $(container).addClass('event-add-title-image-preview-container');
    const image = $(this).clone();
    const preview = `<div style="background-position:center;background-size:contain;background:url(${URL.createObjectURL(e.target.files[0])})"></div>`;
    /*output = $(this).parent().parent().parent().find('.event-add-title-image-preview');
    output.css('background',`url(${URL.createObjectURL(e.target.files[0])})`);
    $(this).parent().parent().parent().find('.event-add-title-image-preview-name').find('.event-add-title-image-preview-content').text(e.target.files[0].name);
    $(this).parent().parent().parent().find('.event-add-title-image-preview-size').find('.event-add-title-image-preview-content').text(`${e.target.files[0].size} B`);
    $(this).parent().parent().parent().find('.event-add-title-image-preview-desc').show()
    output.css('background-size','contain');
    output.css('background-position','center');
    output.css('background-repeat','no-repeat');
    console.log($(this).val());*/
})

