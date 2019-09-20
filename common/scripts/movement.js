(($) => {
    const highlightMovement = setInterval(() => {
        const menu = $('#menuTable li');
        if (menu.length >= 9 && menu.eq(8).text().trim() === 'Fleet movement') {
            menu.eq(7).find('a').removeClass('selected');
            menu.eq(8).find('a').addClass('selected');
            clearInterval(highlightMovement);
        }
    });

    const showRecallTimerAndComposition = setInterval(() => {
        const movements = $('.fleetDetails');
        if (movements.length) {
            movements.each(index => {
                const movement = movements.eq(index);

                const recallButton = movement.find('.icon_link.tooltipHTML').eq(0);
                if (recallButton.attr('title')) {
                    const recallTimer = recallButton.attr('title').replace(/\|/g, '<br>');
                    const recallSpan = '<span class="recallTimer">' + recallTimer + '</span>';
                    movement.append(recallSpan);
                }

                const tooltipId = movement.find('.fleetDetailButton a').attr('href');
                const compositionTrs = $(tooltipId).find('table tr');
                let ships = '';
                let resources = '';
                let readShips = true;
                compositionTrs.each(idx => {
                    const tr = compositionTrs.eq(idx);
                    const tds = tr.find('td');

                    if (tds.length !== 2) {
                        if (tds.length === 1) {
                            readShips = false;
                        }
                        return;
                    }

                    const entity = tds.eq(0).text().trim();
                    const value = tds.eq(1).text().trim();
                    const result = entity + ' ' + value + '  ';
                    if (readShips) {
                        ships += result;
                    } else {
                        resources += result;
                    }

                    // (readShips ? ships : resources) += entity + ' ' + value + '  ';
                });
                const compositionSpan = '<span class="composition">' + resources + '<br>' + ships + '</span>';
                movement.append(compositionSpan);
            });
            clearInterval(showRecallTimerAndComposition);
        }
    });
})(jQuery);
