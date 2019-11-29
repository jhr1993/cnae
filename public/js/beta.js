$(document).on('click','.event-add-form-submit',function(e){
    e.preventDefault();
    $('.event-add-required .event-add-sector-sub-content-input').val(function(i, origValue){
        if(origValue == '' || origValue == ' '){
            $(this).parent().parent().find('.alert-msg-type-error').show();
            $(this).parent().addClass('alert-msg-active-error');
        }
        return origValue;
    })
    $('.event-add-required .event-add-sector-sub-content-input').html(function(i, origValue){
        if(origValue == '' || origValue == ' '){
            $(this).parent().parent().find('.alert-msg-type-error').show();
            $(this).parent().addClass('alert-msg-active-error');
        }
        return origValue;
    })
})