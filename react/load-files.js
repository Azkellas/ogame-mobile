'use strict';
/* jshint node: true */

import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

/** create directory if needed
 * @param {string} directory: directory to create
 * @return {Promise}
 */
function createDirectory(directory) {
    const directoryPath = FileSystem.documentDirectory + directory;
    return FileSystem.getInfoAsync(directoryPath)
    .then(infoRes => {
        if (infoRes.exists) {
            return Promise.resolve(directory + ' already exists');
        }
        return FileSystem.makeDirectoryAsync(directoryPath)
    });
}

/** download local file from asset if necessary, then load file content from local file
 * @param {Object} file: {name, asset}
 * modify file such that it becomes {name, asset, content} 
 * @return {Promise}
 */
function createAndLoadFile(file) {
    const fileUri = Asset.fromModule(file.asset).uri;
    return FileSystem.getInfoAsync(FileSystem.documentDirectory + file.name)
    .then(infoRes => {
        if (infoRes.exists) {
            // issue when developping: does not account for file modifications
            // return Promise.resolve('{already downloaded}');
        }
        return FileSystem.downloadAsync(fileUri, FileSystem.documentDirectory + file.name);
    }).then(res => {
        // now we read file
        return FileSystem.readAsStringAsync(FileSystem.documentDirectory + file.name);
    }).then(data => {
        file.content = data;
        return Promise.resolve('Successfully read ' + file.name);
    }).catch(err => {
        console.log('createAndLoadFile failed: ', err);
        return Promise.reject(err);
    });
}

/** create accessible files at the very first launch of the app (or when the user clears the app data)
 *  by downloading them (copying) from a non-readable space to FileSystem.documentDirectory
 * @param {Object} files: object { thirdparties: [], scripts: [], styles: [] }
 * @return {Promise}
 */
export function initFiles(files) {
    // make sure all directories exist
    const directories = ['scripts', 'styles', 'third-parties'];
    return Promise.all(directories.map(createDirectory))
    .then(data => {
        console.log('Successfully created directories: ', data);
        let allFiles = [];
        for (let type in files) {
            allFiles = allFiles.concat(files[type]);
        }
        return Promise.all(allFiles.map(createAndLoadFile));
    });
}
