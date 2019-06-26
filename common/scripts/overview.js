(($) => {
    var movePlanetContent = setInterval(() => {
        if ($('#planetdata').length && $('#detailWrapper')) {
            $('#contentWrapper').prepend($('#detailWrapper'));
            clearInterval(movePlanetContent);
        }
    });
})(jQuery);
