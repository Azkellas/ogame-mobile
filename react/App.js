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
const files = {
    'https://lobby.ogame.gameforge.com/*': {
        files: [
            {name: scriptLobby, type: 'script', asset: require(scriptLobby + '.txt')}
        ]
    },

    'https://*.ogame.gameforge.com/game/index.php?*': {
        files: [
            {name: thirdParty1, type: 'script', asset: require(thirdParty1 + '.txt')},
            {name: thirdParty2, type: 'script', asset: require(thirdParty2 + '.txt')},

            {name: script1, type: 'script', asset: require(script1 + '.txt')},
            {name: script2, type: 'script', asset: require(script2 + '.txt')},

            {name: style1, type: 'style', asset: require(style1 + '.txt')},
            {name: style2, type: 'style', asset: require(style2 + '.txt')},
        ]
    }
};

const debugging = `
console = new Object();
console.log = (message) => {window.postMessage(message)};
console.debug = console.log;
console.info = console.log;
console.warn = console.log;
console.error = console.log;

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    console.log("Error occured: " + errorMsg);
    return false;
}
`;

/**
 * Compute the javascript to inject in the current page, waiting for files to load if necessary
 * @param {string} url current url
 * @return {string} javascript to inject in the current url
 */
function computeInjectedJavaScript(url) {
    return new Promise(resolve => {
        const filesToAdd = [];
        for (const matcher in files) {
            if (url.match(matcher.replace(/\*/g, '.*'))) {
                for (const file of files[matcher].files) {
                    if (filesToAdd.indexOf(file) === -1) {
                        filesToAdd.push(file);
                    }
                }
            }
        }
        console.log('inject files:', filesToAdd.map(file => file.name));

        const waitForLoading = setInterval((filesToAdd) => {
            let filesLoaded = 0;
            for (const file of filesToAdd) {
                if ('content' in file) {
                    filesLoaded++;
                }
            }

            if (filesLoaded === filesToAdd.length) {
                let jsToInject = debugging + '\n';
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
                    var node = document.createElement('style');
                    node.innerHTML = \`` + cssToInject + `\`;
                    document.body.appendChild(node);
                `;

                resolve(jsToInject);
            }
        }, 10, filesToAdd);
    });
}


var alreadyInjected = false;

class OgameWebView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: 'https://lobby.ogame.gameforge.com/'
        };
    }

    tryInject(url) {
        if (url && !alreadyInjected) {
            alreadyInjected = true;
            computeInjectedJavaScript(url).then( content => {
                console.log('injected');
                this.webview.injectJavaScript(content);
            });
        }
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
                this.setState(JSON.parse(request.responseText));
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

                    onLoadStart={e => {
                        alreadyInjected = false;
                        console.log('loading:', this.state.url);
                        console.log(e.nativeEvent.url);
                    }}
                    onLoadProgress={e => {this.tryInject(e.nativeEvent.url);}}
                    onLoadEnd={e => {this.tryInject(e.nativeEvent.url);}}

                    domStorageEnabled = {true}
                    mixedContentMode = {'always'}

                    dataDetectorTypes = {'all'}
                    onMessage={event => {
                        try {
                            const message = JSON.parse(event.nativeEvent.data);
                            console.log('received:', message);
                            if (message.url) {
                                this.logIntoAccount(message.url);
                            }
                        } catch (e) {
                            console.log('received :', event.nativeEvent.data);
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
