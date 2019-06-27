(($) => {
    var preventMoonClick = setInterval(() => {
        if ($('#galaxytable td.moon').length === 15) {
            // cancel spying on click for moons
            $('.moon_a').on('click', (e) => {e.stopPropagation();});
            clearInterval(preventMoonClick);
        }
    });
})(jQuery);
