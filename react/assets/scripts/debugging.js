/* eslint-disable */
/**
 * This file rewrites console to forward all debugging to React console
 */

console = new Object();
function sendMessageToReact(type, message) {
    const toSend = {
        type: type,
        message: message
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(toSend))

}
console.log = (message) => {sendMessageToReact('log', message);};
console.debug = (message) => {sendMessageToReact('debug', message);};
console.info = (message) => {sendMessageToReact('info', message);};
console.warn = (message) => {sendMessageToReact('warn', message);};
console.error = (message) => {sendMessageToReact('error', message);};

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    sendMessageToReact('error', errorMsg);
    return false;
}
