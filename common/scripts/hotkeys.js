'use strict';
const keyCode = [
    112,  // F1
    113,  // F2
    114,  // ...
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    123   // F12
];

console.log('omfg');
// planet selction
var smartPlanetDisplay = setInterval(function() {
    if ($('.smallplanet').length)
    {
        const numberOfPlanets = $('.smallplanet').length;
        $(document).keydown(function(event) {
            const planetNumber = keyCode.indexOf(event.keyCode);
            if (planetNumber !== -1 && planetNumber < numberOfPlanets)
            {
                event.preventDefault();
                const smallplanet = $('#planetList .smallplanet').eq(planetNumber);
                if (event.shiftKey)
                {
                    const aToClick = smallplanet.find('a').eq(1);
                    if (aToClick.length)
                    {
                        // check if there is a moon there
                        aToClick[0].click();
                        smallplanet.css('background-color', 'rgba(142, 94, 0, 0.3)');
                    }
                }
                else
                {
                    const aToClick = smallplanet.find('a').eq(0);
                    aToClick[0].click();
                    smallplanet.css('background-color', 'rgba(94, 142, 0, 0.3)');
                }
            }
        });
        clearInterval(smartPlanetDisplay);
    }
}, 1);
