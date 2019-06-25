'use strict';

var catchServer = setInterval(() => {
    let button = document.getElementsByClassName('button button-default button-md');
    if (button.length) {
        button = button[0];
        // console.log(button);
        let reactAttr = null;
        for (const attr in button) {
            if (attr.match(/__reactEventHandlers/)) {
                reactAttr = button[attr];
            }
        }

        if (reactAttr) {
            try {
                const server = reactAttr.children.props.server;
                const accounts = reactAttr.children._owner.memoizedProps.accounts;
                let accountId = null;
                for (const account of accounts) {
                    if (server.language === account.server.language && server.number === account.server.number) {
                        accountId = account.id;
                        console.log('got Id');
                    }
                }
                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log('clicked');
                    const loginUrl = 'https://lobby.ogame.gameforge.com/api/users/me/loginLink'
                        + '?id=' + accountId
                        + '&server[language]=' + server.language
                        + '&server[number]=' + server.number;
                    const toSend = {url: loginUrl};
                    window.ReactNativeWebView.postMessage(JSON.stringify(toSend));
                });
                clearInterval(catchServer);
            } catch (e) {
                console.log('could not get server or account id');
            }
        }
    }
}, 10);
