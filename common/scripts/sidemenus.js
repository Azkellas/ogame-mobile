/* globals Slideout */
'use strict';

(($) => {
    var createWrapper = setInterval(() => {
        if ($('body').length) {
            $('body').append('<div id="oMobileWrapper"></div>');
            clearInterval(createWrapper);
            $('#oMobileWrapper').css('top', '0px');
        }
    }, 10);


    var moveValuableInfos = setInterval(() => {
        if ($('#oMobileWrapper').length && $('ul#resources').length && $('#message-wrapper').length && $('#bar').length && $('#officers').length) {
            $('#oMobileWrapper')
                .prepend($('#message-wrapper'))
                .prepend($('#officers'))
                .prepend($('ul#resources'))
                .prepend($('#bar'));
            $('#message-wrapper').css('position', 'initial');
            $('#message_collapsed').css('width', '50vw');
            $('#message_collapsed > event_list > event_list').css('display', 'flex');
            $('#attack_alert')
                .css('right', '0px')
                .css('position', 'absolute');
            clearInterval(moveValuableInfos);
        }
    });

    var createMenu = setInterval(() => {
        if ($('#oMobileWrapper').length && $('#oMobileWrapper').hasClass('slideout-panel')) {
            clearInterval(createMenu);
            return;
        }
        if ($('#oMobileWrapper').length && $('#toolbarcomponent') && $('#contentWrapper').length && $('#links').length && $('#rechts').length) {
            $('#oMobileWrapper').append($('#contentWrapper'));

            $('#links').css('overflow', 'hidden');
            $('#toolbarcomponent').css('display', 'block');
            console.log('made toolbar visible: ', $('#toolbarcomponent').css('display'));
            var leftSlideout = new Slideout({
                'panel': document.getElementById('oMobileWrapper'),
                'menu': document.getElementById('links'),
                'padding': 130,
                'tolerance': 70,
                'side': 'left'
            });

            $('#rechts').css('top', '0px');
            var rightSlideout = new Slideout({
                'panel': document.getElementById('oMobileWrapper'),
                'menu': document.getElementById('rechts'),
                'padding': 140,
                'tolerance': 70,
                'side': 'right'
            });

            clearInterval(createMenu);
        }
    }, 10);

    var adaptPlanetSize = setInterval(() => {
        if ($('#countColonies').length) {
            const nPlanets = parseInt($('#countColonies').text().split('/')[0]);
            if (nPlanets) {
                clearInterval(adaptPlanetSize);
                console.log('found ' + nPlanets + ' planets ' + 90/nPlanets + 'vh');
                $('#planetList .smallplanet').css('height', 90/nPlanets + 'vh');
            }
        }
    }, 10);
})(jQuery);
