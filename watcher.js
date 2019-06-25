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

/**
 * Logs each action
 * @param {string} logType 'Error' or 'Success'
 * @param {string} extension 'Extension' or 'React'
 * @param  {...any} args input to feed to console.log
 */
function log(logType, extension, ...args) {
    const color = logType === 'Error' ? chalk.red : chalk.green;
    console.log(color(('[' + extension + ']').padEnd(typeLength, ' ')), ...args);
}

const commonRegex = new RegExp(path.resolve(__dirname, './common/'));
const reactCommonPath = path.resolve(__dirname, './react/common/');
const extensionCommonPath = path.resolve(__dirname, './extension/common/');

/**
 * path/to/common/fileName => path/to/react/common/fileName.txt
 * @param {string} fileName
 */
function getReactFileName(fileName) {
    return fileName.replace(commonRegex, reactCommonPath) + '.txt';
}

/**
 * path/to/common/fileName => path/to/extension/common/fileName.txt
 * @param {string} fileName
 */
function getExtensionFileName(fileName) {
    return fileName.replace(commonRegex, extensionCommonPath);
}

/**
 * path/to/(extension|react)/common/fileName => path/to/common/fileName
 * @param {*} fileName
 */
function getRealFileName(fileName) {
    return fileName.replace('/extension/common/', '/common/').replace('/react/common/', '/common/').replace(/\.txt$/, '');
}


// process project to manage
let manageExtension = false;
let manageReact = false;

const arg = process.argv[2];
if (!arg || arg === 'both') {
    manageExtension = true;
    manageReact = true;
} else if (arg === 'extension') {
    manageExtension = true;
} else if (arg === 'react') {
    manageReact = true;
} else {
    console.log('Could not parse command line, values accepted: "extension", "react", "both"');
    process.exit();
}

/**
 * Copy watched file to its new location
 * @param {string} fileName file adress to copy
 * @param {string} newFileName destination
 * @param {string} type 'React' or 'Extension', for logging purpose
 * @param {string} event 'delete', 'update', etc. for logging purpose
 */
function copyFile(fileName, newFileName, type, event) {
    fs.copy(fileName, newFileName, copyError => {
        if (copyError) {
            log('Error', type, 'Could not copy: ' + fileName + ': ' + copyError + ' (event: ' + event + '), ' + newFileName);
        } else {
            log('Success', type, 'Copied ' + fileName + ' to ' + newFileName + ' (event: ' + event + ')');
        }
    });
}

/**
 * Copy file if needed
 * @param {*} fileName file to copy
 * @param {string} event 'delete', 'update', etc. for logging purpose
 */
function manageFile(fileName, event) {
    // copy file to extension dir
    if (manageExtension) {
        copyFile(fileName, getExtensionFileName(fileName), 'Extension', event);
    }

    // copy to react dir
    if (manageReact) {
        copyFile(fileName, getReactFileName(fileName), 'React', event);
    }
}


const excludeDirFilter = through2.obj(function (item, enc, next) {
    if (!item.stats.isDirectory()) {
        this.push(item);
    }
    next();
});

/**
 * First copy of new files (files that were created when watcher was not active)
 */
function copyNewFiles() {
    klaw(path.resolve(__dirname, './common/'))
        .pipe(excludeDirFilter)
        .on('data', item => {
            const fileName = item.path;
            if (manageExtension) {
                const extensionFileName = getExtensionFileName(fileName);
                if (!fs.existsSync(extensionFileName) || fs.statSync(fileName).mtimeMs > fs.statSync(extensionFileName).mtimeMs) {
                    copyFile(fileName, extensionFileName, 'Extension', 'first check');
                }
            }
            if (manageReact) {
                const reactFileName = getReactFileName(fileName);
                if (!fs.existsSync(reactFileName) || fs.statSync(fileName).mtimeMs > fs.statSync(reactFileName).mtimeMs) {
                    copyFile(fileName, reactFileName, 'React', 'first check');
                }
            }
        });
}

/**
 * Delete (in generated directories) files that were removed from common directory
 * @param {string} type 'Extension' or 'React'
 */
function removeFiles(type) {
    const dirPath = path.resolve(__dirname, './' + (type === 'Extension' ? 'extension' : 'react') + '/common/');
    if (!fs.existsSync(dirPath)) {
        // no generated common directory yet
        return;
    }
    const allFiles = klawSync(dirPath, {nodir: true});
    allFiles.forEach((file) => {
        const fileName = file.path;
        const originalFile = getRealFileName(fileName);
        // we remove the computed file iif it still exists and the original has been deleted
        if (fs.existsSync(fileName) && !fs.existsSync(originalFile)) {
            fs.unlink(fileName, err => {
                if (err) {
                    log('Error', type, 'Could not remove ' + fileName);
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
    if (fileName.slice(-4) === '.swp') {
        // temporary file
        return;
    }

    if (event === 'remove') {
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

// watch new changes in ./react/assets/scripts if needed
if (manageReact) {
    watch(path.resolve(__dirname, './react/assets/scripts/'), { recursive: false }, function(event, fileName) {
        if (fileName.slice(-4) === '.swp') {
            // temporary file
            return;
        }

        let generatedFileName = fileName.split('/');
        generatedFileName.splice(-1, 0, 'generated');
        generatedFileName = generatedFileName.join('/');
        generatedFileName += '.txt';
        console.log(generatedFileName);
        if (event === 'remove') {
            // remove element
            fs.unlink(generatedFileName, err => {
                if (err) {
                    log('Error', 'React', 'Could not remove' + fileName);
                } else {
                    log('Success', 'React', 'Removed ' + fileName);
                }
            });
        } else {
            // copy element
            fs.copy(fileName, generatedFileName, copyError => {
                if (copyError) {
                    log('Error', 'React', 'Could not copy: ' + fileName + ': ' + copyError + ' (event: ' + event + '), ' + generatedFileName);
                } else {
                    log('Success', 'React', 'Copied ' + fileName + ' to ' + generatedFileName + ' (event: ' + event + ')');
                }
            });
        }
    });
}
