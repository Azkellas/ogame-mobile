'use strict';

var appendMenuButton = setInterval(() => {
    if ($('#mmonetbar').length) {
        $('#mmonetbar').css('display', 'none');
        console.log('hide;');
        clearInterval(appendMenuButton);
    }
}, 10);
