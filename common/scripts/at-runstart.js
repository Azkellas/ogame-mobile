'use strict';

(($) => {
    var preventZoom = setInterval(() => {
        if ($('head').length) {
            $('head').append(`<meta meta name="viewport" content=  
            "width=device-width, user-scalable=no" />`);
            clearInterval(preventZoom);
        }
    });

    var eventBoxLoader = setInterval(() => {
        if ($('#eventboxLoading').length && $('#eventboxLoading').css('display') !== 'flex') {
            if ($('#eventboxLoading').css('display') !== 'none') {
                $('#eventboxLoading').css('display', 'flex');
            }
            clearInterval(eventBoxLoader);
        }
    });

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

    var addOptionLi = setInterval(() => {
        if ($('ul#menuTable').length && $('#bar li a').length > 5) {
            const oldButton = $('#bar li a').eq(5);
            $('ul#menuTable').append(`
                <li>
                    <span class="menu_icon">
                        <div class="menuImage shipyard"></div>
                    </span>
                    <a id="OM_options" class="menubutton" href="` + oldButton.attr('href') + `" accesskey="" target="_self">
                        <span class="textlabel">
                            ` + oldButton.text() + `
                        </span>
                    </a>
                </li>
            `);
            clearInterval(addOptionLi);
        }
    });
})(jQuery);
