'use strict';
(($) => {
    var setHCivilshipsTop = setInterval(() => {
        if ($('.h_civilships').length) {
            const height = $( window ).width() < 344 ? 350 : 230;
            $('.h_civilships').css('top', height);
            clearInterval(setHCivilshipsTop);
        }
    });

    var firstScrollPrevented = false;
    $(window).scroll(event => {
        if (firstScrollPrevented) {
            // user scroll
            return true;
        } else {
            // auto scroll to 'continue' button at load
            window.scrollTo(0, 0);
            firstScrollPrevented = true;
        }
    });
})(jQuery);
