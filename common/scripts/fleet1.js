'use strict';
(($) => {
    var setHCivilshipsTop = setInterval(() => {
        if ($('.h_civilships').length) {
            const height = $( window ).width() < 344 ? 350 : 230;
            $('.h_civilships').css('top', height);
            clearInterval(setHCivilshipsTop);
        }
    });
})(jQuery);
