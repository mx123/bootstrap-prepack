import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import esformatter from 'esformatter';
import { esformatterOptions } from './esformatterUtils.js';

export function formatJs(jsData) {
    try {

        return esformatter.format(jsData, esformatterOptions);
    } catch (e) {
        console.error(e);
        throw Error(e.message);
    }
}

export function readFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, {encoding: 'utf8'}, function (err, data) {
            if (err) {
                reject("Can't read file: " + filePath + ". Cause: " + err.message);
            } else {
                resolve(data);
            }
        });
    });
}


