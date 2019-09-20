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



    /**
     * Move bar button to left menu
     * @param {JQuery element} button from the bar li (Friends/Highscore/Options)
     */
    function addLi(button) {
        $('ul#menuTable').append(`
        <li>
            <span class="menu_icon">
                <div class="menuImage shipyard"></div>
            </span>
            <a id="OM_options" class="menubutton" href="` + button.attr('href') + `" accesskey="" target="_self">
                <span class="textlabel">
                    ` + button.text() + `
                </span>
            </a>
        </li>`);
    }

    var addLis = setInterval(() => {
        if ($('ul#menuTable').length && $('#bar li a').length > 5) {
            const optionButton = $('#bar li a').eq(5);
            const highscoreButton = $('#bar li a').eq(1);
            const friendsButton = $('#bar li a').eq(3);

            const movementsUrl = $('#menuTable .menu_icon a').eq(0).attr('href').replace(/\?page=.*/, '?page=movement');
            const movementsName = 'Fleet movement';  // no way to find localisation for now
            addLi(optionButton);
            addLi(highscoreButton);
            addLi(friendsButton);

            $('ul#menuTable li').eq(7).after(`
            <li>
                <span class="menu_icon">
                    <div class="menuImage shipyard"></div>
                </span>
                <a id="OM_options" class="menubutton" href="` + movementsUrl + `" accesskey="" target="_self">
                    <span class="textlabel">
                        ` + movementsName + `
                    </span>
                </a>
            </li>`);
    
            clearInterval(addLis);
        }
    });

    var hideOfficers = setInterval(() => {
        if ($('#officers').length && $('#darkmatter_box img').length) {
            const officers = $('#officers').first();
            $('#darkmatter_box img').click(event => {
                const newDisplay = officers.css('display') === 'none' ? 'inherit' : 'none';
                officers.css('display', newDisplay);
                event.preventDefault();
                event.stopPropagation();
            });
            officers.css('display', 'none');
            clearInterval(hideOfficers);
        }
    });
})(jQuery);
