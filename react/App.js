import * as React from 'react';
import { View, StyleSheet, WebView, Alert } from 'react-native';
import Constants from 'expo-constants';

import { initFiles } from './load-files';


var jsToInject = '';
var cssToInject = '';

// note: this iso mandatory
// require() must have const in input, so no loop is possible
const thirdParty1 = 'jquery.min.js';
const thirdParty2 = 'slideout.js';

const script1 = 'at-runstart.js';
const script2 = 'sidemenus.js';

const style1 = 'slideout.css';
const style2 = 'main.css';

const files = {
    thirdParties: [
        {name: 'third-parties/' + thirdParty1, asset: require('./common/third-parties/' + thirdParty1 + '.txt')},
        {name: 'third-parties/' + thirdParty2, asset: require('./common/third-parties/' + thirdParty2 + '.txt')},
    ],
    scripts: [
        {name: 'scripts/' + script1, asset: require('./common/scripts/' + script1 + '.txt')},
        {name: 'scripts/' + script2, asset: require('./common/scripts/' + script2 + '.txt')},
    ],
    styles: [
        {name: 'styles/' + style1, asset: require('./common/styles/' + style1 + '.txt')},
        {name: 'styles/' + style2, asset: require('./common/styles/' + style2 + '.txt')},
    ]
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

jsToInject += debugging;

function computeInjectedJavaScript() {
    for (let thirdParty of files.thirdParties) {
        jsToInject += thirdParty.content + '\n';
    }
    for (let script of files.scripts) {
        jsToInject += script.content + '\n';
    }

    for (let style of files.styles) {
        cssToInject += style.content + '\n';
    }

    jsToInject +=`
        var node = document.createElement('style');
        node.innerHTML = \`` + cssToInject + `\`;
        document.body.appendChild(node);
    `;
}

const App = () => {
    initFiles(files).then(res => {
        console.log('Successfully read files', res);
        computeInjectedJavaScript();
    }).catch(err => {
        console.log('Failed reading files: ', err);
        Alert('failed loading files: ', err);
    });

    return (
        <WebViewExample/>
    )
}

export default App;

var alreadyInjected = false;

const WebViewExample = () => {
      return (
        <View style = {styles.container}>
            <WebView
                ref={r => this.webview = r}
                source={{ uri: 'https://lobby.ogame.gameforge.com' }}
                style={{ flex: 1 }}

                onLoadStart={e => {
                    this.webview.injectJavaScript(jsToInject);
              }}
        
                onMessage={event => {
                    console.log('received :', event.nativeEvent);
                }}

                onLoadProgress={e => {
                    if (!alreadyInjected) {
                      alreadyInjected = true;
                      this.webview.injectJavaScript(jsToInject);
                    }
                }}

                onLoadEnd={e => {
                    if (!alreadyInjected) {
                      alreadyInjected = true;
                      this.webview.injectJavaScript(jsToInject);
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        paddingBottom: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
})
