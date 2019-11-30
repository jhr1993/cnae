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