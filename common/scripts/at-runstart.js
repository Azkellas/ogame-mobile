'use strict';
console.log('runstart');
var appendMenuButton = setInterval(function() {
    if ($('#mmonetbar').length) {
        $('#mmonetbar').css('display', 'none');
        console.log('hide;');
        clearInterval(appendMenuButton);
    }
}, 10);

