/* globals Slideout */
'use strict';

console.log('Im in');
const sidemenu = `
<nav id="leftMenu">
    <header>
        <h2>Menu</h2>
    </header>
</nav>

<nav id="rightMenu">
    <header>
        <h2>Menu</h2>
    </header>
</nav>

<main id="panel">
    <header>
        <h2>Panel</h2>
    </header>
</main>
`;

var createMenu = setInterval(() => {
    if ($('body').length) {
        $('body').append(sidemenu);

        var leftSlideout = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': document.getElementById('leftMenu'),
            'padding': 256,
            'tolerance': 70
        });

        var rightSlideout = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': document.getElementById('rightMenu'),
            'padding': 256,
            'tolerance': 70,
            'side': 'right'
        });
        clearInterval(createMenu);
    }
}, 1000);
