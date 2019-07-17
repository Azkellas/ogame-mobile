(($) => {
    var moveTrashbox = setInterval(() => {
        if ($('ul.subtabs li.trash_tab').length) {
            $('#ui-id-2').append($('ul.subtabs li.trash_tab'));
            console.log('moved trash');
            //clearInterval(moveTrashbox);
        }
    })
})(jQuery);
