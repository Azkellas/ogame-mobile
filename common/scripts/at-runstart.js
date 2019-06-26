'use strict';

(($) => {
    var preventZoom = setInterval(() => {
        if ($('head').length) {
            $('head').append(`<meta meta name="viewport" content=  
            "width=device-width, user-scalable=no" />`);
            clearInterval(preventZoom);
        }
    });

    var hideFooter = setInterval(() => {
        if ($('#siteFooter').length) {
            $('#siteFooter').css('display', 'none');
            clearInterval(hideFooter);
        }
    });

    var hideTop = setInterval(() => {
        if ($('#info').length) {
            $('#info').css('display', 'none');
            clearInterval(hideTop);
        }
    });

    var hideMenu = setInterval(() => {
        if ($('#toolbarcomponent').length) {
            $('#toolbarcomponent').css('display', 'none');
            clearInterval(hideMenu);
        }
    });

    var timeSpent = 0;
    var appendMenuButton = setInterval(() => {
        if ($('#mmoContent').length && $('#mmonetbar').length && ($('#mmoContent').css('display') === 'block' || $('#mmonetbar').css('display') === 'block')) {
            $('#mmonetbar').css('display', 'none');
            $('#mmoContent').css('display', 'none');
            timeSpent += 10;
            console.log('hide;');
        }
        if (timeSpent > 1000) {
            clearInterval(appendMenuButton);
        }
    }, 10);

    var moveMoons = setInterval(() => {
        if ($('.smallplanet .moonlink').length) {
            // better alignement
            $('.smallplanet').each(function(id, smallplanet) {
                // background color
                if ($(smallplanet).find('.active').length) {
                    if ($(smallplanet).find('.moon_active').length) {
                        $(smallplanet).css('background-color', 'rgba(142, 94, 0, 0.3)');
                    } else {
                        $(smallplanet).css('background-color', 'rgba(94, 142, 0, 0.3)');
                        // outer glow
                        $(smallplanet).find('.planetPic')
                            .css('box-shadow',  '0 0 6px 1px #9C0, inset 0 0 3px 4px #9C0');
                    }
                }

                // change moon hover glow
                let baseColor = '';
                if ($(smallplanet).find('.moon_active').length) {
                    baseColor = $(smallplanet).find('.planet-name').css('color');
                }

                $(smallplanet).find('.moonlink').hover(
                    function() {
                        $(this).find('img').css('box-shadow',  '0 0 6px 1px #C90, inset 0 0 3px 4px #C90');
                        $(smallplanet).find('.planet-name')
                            .css('color', '#C90');
                        $(smallplanet).find('.planet-koords')
                            .css('color', '#C90');
                    },
                    function() {
                        $(this).find('img').css('box-shadow',  '');
                        $(smallplanet).find('.planet-name')
                            .css('color', baseColor);
                        $(smallplanet).find('.planet-koords')
                            .css('color', baseColor);
                    }
                );
            });
            clearInterval(moveMoons);
        }
    }, 10);
})(jQuery);
