/* jshint node: true */
'use strict';

const watch = require('node-watch');
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const klawSync = require('klaw-sync');
const klaw = require('klaw');
const through2 = require('through2');

const typeLength = '[Extension]'.length;

function log(logType, extension, ...args) {
    const color = logType === 'Error' ? chalk.red : chalk.green;
    console.log(color(('[' + extension + ']').padEnd(typeLength, ' ')), ...args);
}

const commonRegex = new RegExp(__dirname + '/common/');

function getReactFileName(fileName) {
    return fileName.replace(commonRegex,__dirname + '/react/common/').replace(/\.js$/, '.json');
}

function getExtensionFileName(fileName) {
    return fileName.replace(commonRegex, __dirname + '/extension/common/');
}

function getRealFileName(fileName) {
    return fileName.replace('/extension/common/', '/common/').replace('/react/common/', '/common/').replace(/\.json$/, '.js');
}


// process project to manage
let manageExtension = false;
let manageReact = false;

const arg = process.argv[2];
if (!arg || arg == 'both') {
    manageExtension = true;
    manageReact = true;
} else if (arg == 'extension') {
    manageExtension = true;
} else if (arg == 'react') {
    manageReact = true;
} else {
    console.log('Could not parse command line, values accepted: "extension", "react", "both"');
    process.exit();
}

function copyToExtension(fileName, event) {
    const extensionFileName = getExtensionFileName(fileName);
    fs.copy(fileName, extensionFileName, copyError => {
        if (copyError) {
            log('Error', 'Extension', 'Could not copy: ' + fileName + ': ' + copyError + ' (event: ' + event + '), ' + extensionFileName);
        } else {
            log('Success', 'Extension', 'Copied ' + fileName + ' to ' + extensionFileName + ' (event: ' + event + ')');
        }
    });
}

function copyToReact(fileName, event) {
    fs.readFile(fileName, 'utf8', (readError, fileData) => {
        if (readError) {
            log('Error', 'React', 'Could not open ' + fileName + ': ' + readError  + ' (event: ' + event + ')');
            return;
        }

        const reactFileName = getReactFileName(fileName);
        const json = `{ "script" : "` + fileData.replace(/\n/g, '\\n') + `"}`;
        fs.outputFile(reactFileName, json, (writeError) => {
            if (writeError) {
                log('Error', 'React', 'Could not save ' + fileName + ': ' + writeError + ' (event: ' + event + '), ' + reactFileName);
            } else {
                log('Success', 'React', 'Saved  ' + fileName + ' to ' + reactFileName + ' (event: ' + event + ')');
            }
        });
    });  
}

function manageFile(fileName, event) {
    // copy file to extension dir
    if (manageExtension) {
        copyToExtension(fileName, event);
    }

    // copy to react dir
    if (manageReact) {
        copyToReact(fileName, event);
    }

}


const excludeDirFilter = through2.obj(function (item, enc, next) {
    if (!item.stats.isDirectory()) {
        this.push(item);
    }
    next();
});

// first copy
function copyNewFiles() {
    klaw(__dirname + '/common/')
    .pipe(excludeDirFilter)
    .on('data', item => {
        const fileName = item.path;
        if (manageExtension) {
            const extensionFileName = getExtensionFileName(fileName);
            if (!fs.existsSync(extensionFileName) || fs.statSync(fileName).mtimeMs > fs.statSync(extensionFileName).mtimeMs) {
                copyToExtension(fileName, 'first check');

            }
        }
        if (manageReact) {
            const reactFileName = getReactFileName(fileName);
            if (!fs.existsSync(reactFileName) || fs.statSync(fileName).mtimeMs > fs.statSync(reactFileName).mtimeMs) {
                copyToReact(fileName, 'first check');
            }
        }
    });
}

// get rid of removed filed in generated dir
function removeFiles(type) {
    const dirPath = __dirname + '/' + (type == 'Extension' ? 'extension' : 'react') + '/common/';
    if (!fs.existsSync(dirPath)) {
        // no generated common directory yet
        return;
    }
    const allFiles = klawSync(dirPath, {nodir: true});
    allFiles.forEach((file, idx, arr) => {
        const fileName = file.path;
        const originalFile = getRealFileName(fileName);
        // we remove the computed file iif it still exists and the original has been deleted
        if (fs.existsSync(fileName) && !fs.existsSync(originalFile)) {
            fs.unlink(fileName, err => {
                if (err) {
                    log('Error', type, 'Could not remove' + fileName);
                } else {
                    log('Success', type, 'Removed ' + fileName);
                }
            });
        }
    });
}

// copy new files from ./common
copyNewFiles();

// remove files from generated dir (./extension/common & ./react/common) that were deleted from ./common
if (manageExtension) {
    removeFiles('Extension');
}
if (manageReact) {
    removeFiles('React');
}

// watch new changes in ./common
watch(path.resolve(__dirname, './common/'), { recursive: true }, function(event, fileName) {
    if (fileName.slice(-4) == '.swp') {
        // temporary file
        return;
    }

    if (event == 'remove') {
        // remove element
        if (manageExtension) {
            const extensionFileName = getExtensionFileName(fileName);            
            fs.unlink(extensionFileName, err => {
                if (err) {
                    log('Error', 'Extension', 'Could not remove' + fileName);
                } else {
                    log('Success', 'Extension', 'Removed ' + fileName);
                }
            });
        }
        if (manageReact) {
            const reactFileName = getReactFileName(fileName);            
            fs.unlink(reactFileName, err => {
                if (err) {
                    log('Error', 'React', 'Could not remove' + fileName);
                } else {
                    log('Success', 'React', 'Removed ' + fileName);
                }
            });
        }
    } else {
        // copy element
        manageFile(fileName, event);
    }
});
