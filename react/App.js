'use strict';

import * as React from 'react';

import { View, StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';

import { WebView } from 'react-native-webview';

import { initFiles } from './load-files';

// note: this iso mandatory
// require() must have const in input, so no loop is possible
const thirdParty1 = './common/third-parties/jquery.min.js';
const thirdParty2 = './common/third-parties/slideout.js';

const script1 = './common/scripts/at-runstart.js';
const script2 = './common/scripts/sidemenus.js';

const style1 = './common/styles/slideout.css';
const style2 = './common/styles/main.css';

const scriptLobby = './assets/scripts/generated/lobby.js';
const scriptConsole = './assets/scripts/generated/debugging.js';
const files = {
    'https://lobby.ogame.gameforge.com/*': {
        files: [
            {name: scriptConsole, type: 'script', asset: require(scriptConsole + '.txt')},
            {name: scriptLobby, type: 'script', asset: require(scriptLobby + '.txt')}
        ]
    },

    'https://*.ogame.gameforge.com/game/index.php?*': {
        files: [
            {name: scriptConsole, type: 'script', asset: require(scriptConsole + '.txt')},

            {name: thirdParty1, type: 'script', asset: require(thirdParty1 + '.txt')},
            {name: thirdParty2, type: 'script', asset: require(thirdParty2 + '.txt')},

            {name: script1, type: 'script', asset: require(script1 + '.txt')},
            {name: script2, type: 'script', asset: require(script2 + '.txt')},

            {name: style1, type: 'style', asset: require(style1 + '.txt')},
            {name: style2, type: 'style', asset: require(style2 + '.txt')},
        ]
    }
};



/**
 * Compute the javascript to inject in the current page, waiting for files to load if necessary
 * @param {string} url current url
 * @return {string} javascript to inject in the current url
 */
function computeInjectedJavaScript(pageUrl) {
    return new Promise(resolve => {
        pageUrl = pageUrl.split('&')[0];
        console.log('compute for', pageUrl);
        if (files.url) {
            return resolve(files.url);
        }

        const filesToAdd = [];
        let urlMatcher = null;
        for (const matcher in files) {
            if (pageUrl.match(matcher.replace(/\*/g, '.*'))) {
                if (files[matcher].injectScript) {
                    return resolve(files[matcher].injectScript);
                }
                urlMatcher = matcher;
                for (const file of files[matcher].files) {
                    if (filesToAdd.indexOf(file) === -1) {
                        filesToAdd.push(file);
                    }
                }
            }
        }
        console.log('inject files for ' + pageUrl + ':', filesToAdd.map(file => file.name));

        const waitForLoading = setInterval((filesToAdd) => {
            let filesLoaded = 0;
            for (const file of filesToAdd) {
                if ('content' in file) {
                    filesLoaded++;
                }
            }

            if (filesLoaded === filesToAdd.length) {
                let jsToInject = `(() => {
                `;
                let cssToInject = '';

                clearInterval(waitForLoading);

                for (const file of filesToAdd) {
                    if (file.type === 'script') {
                        jsToInject += file.content + '\n';
                    } else if (file.type === 'style') {
                        cssToInject += file.content + '\n';
                    }
                }

                jsToInject +=`
                    (() => {
                        var cssInterval = setInterval(() => {
                            if (document.body) {
                                var node = document.createElement('style');
                                node.innerHTML = \`` + cssToInject + `\`;
                                document.body.appendChild(node);
                                clearInterval(cssInterval);    
                            }
                        }, 10);
                    })();
                `;

                jsToInject += `
                    window.ReactNativeWebView.postMessage('inject ok');
                })();
                `;

                if (urlMatcher) {
                    files[urlMatcher].injectScript = jsToInject;
                }
                files[pageUrl] = jsToInject;

                return resolve(jsToInject);
            }
        }, 10, filesToAdd);
    });
}

var currentPageCount = 0;


class OgameWebView extends React.Component {
    constructor(props) {
        super(props);
        this.webref = null;
        this.state = {
            url: 'https://lobby.ogame.gameforge.com/'
        };
        this.injectInterval = null;
        this.url = null;
    }

    tryInject(url) {
        if (url) {
            console.log('query inject');
            computeInjectedJavaScript(url).then(content => {
                console.log('injecting real..');
                if (url.indexOf('relogin') !== -1) {
                    console.log(url);
                }
                this.webview.injectJavaScript(content);
            });
        }
    }

    checkConnection() {
        clearInterval(this.injectInterval);
        this.injectInterval = setInterval(() => {
            this.webview.injectJavaScript(`window.ReactNativeWebView.postMessage(window.location.href);`);
        }, 1);
    }

    logIntoAccount(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return;
            }

            if (request.status === 200) {
                let loginUrl = JSON.parse(request.responseText).url;
                currentPageCount++;
                loginUrl += (loginUrl.indexOf('?') === -1 ? '?' : '&') + 'pageCount=' + currentPageCount;
                this.setState({url: loginUrl});
            } else {
                Alert('Could not get access to universe');
            }
        };
    }

    render() {
        return (
            <View style = {styles.container}>
                <WebView
                    ref={r => {this.webview = r;}}
                    source={{ uri: this.state.url }}
                    style={{ flex: 1 }}

                    javaScriptEnabled={true}

                    mixedContentMode={'compatibility'}

                    onLoadStart={e => {
                        console.log('loading:', e.nativeEvent.url);
                        console.log('start injecting');
                        this.checkConnection();

                        const url = e.nativeEvent.url;
                        if (url.indexOf('pageCount=') === -1) {
                            currentPageCount++;
                            const newUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + 'pageCount=' + currentPageCount;
                            this.setState({url: newUrl});
                            this.url = this.state.url;
                        } else {
                            this.url = url;
                        }
                    }}

                    domStorageEnabled = {true}

                    dataDetectorTypes = {'all'}
                    onMessage={event => {
                        try {
                            const message = JSON.parse(event.nativeEvent.data);
                            console.log('received:', message);
                            if (message.url) {
                                this.logIntoAccount(message.url);
                            }
                        } catch (e) {
                            if (this.injectInterval && event.nativeEvent.data && event.nativeEvent.data === this.url) {
                                console.log('stop injecting');
                                clearInterval(this.injectInterval);
                                this.injectInterval = null;
                                this.tryInject(this.url);
                            }
                            if (event.nativeEvent.data === 'inject ok') {
                                console.log('inject ok');
                            }
                        }
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#092647'
    },
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

        initFiles(files).then(res => {
            console.log('Successfully read files', res);
        }).catch(err => {
            console.log('Failed reading files: ', err);
            Alert('failed loading files: ', err);
        });
    }

    render() {
        return (<OgameWebView/>);
    }
}

export default App;
