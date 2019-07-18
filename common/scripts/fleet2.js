'use strict';
(($) => {
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
