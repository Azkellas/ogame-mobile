import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

import json from './common/scripts/external';

const App = () => {
    console.log('json');
    console.log(json);

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
                ref={r => (this.webref = r)}
                // https://lobby.ogame.gameforge.com
                source = {{ uri: 'https://jquery.com/' }}
                // injectedJavaScript = {String(ext.default) + 'ex();'}
                // onLoadStart = { e => {  this.webref.injectJavaScript(toInject); }}
                onLoadStart={e => {
                    alreadyInjected = false;
                }}
        
                onLoadProgress={e => {
                    if (!alreadyInjected) {
                      alreadyInjected = true;
                      console.log('injected');
                      this.webref.injectJavaScript(json.script + 'ex();');
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    body: {
        color: 'red'
    }
})
