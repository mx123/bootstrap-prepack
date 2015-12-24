import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import esformatter from 'esformatter';
import { esformatterOptions } from './esformatterUtils.js';
import esprima from 'esprima';
import escodegen from 'escodegen';
import request from 'request';

export function fetch(url, body){
    return new Promise((resolve, reject) => {
        try {
            let requestOptions = {
                uri: url,
                method: 'POST',
                strictSSL: false,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                auth: {
                    'user': 'user',
                    'pass': 'password',
                    'sendImmediately': true
                },
                json: true,
                body: body
            };
            request(
                requestOptions,
                (error, response, body) => {
                    //console.log(JSON.stringify(body, null, 4));
                    if (response) {
                        if (response.statusCode !== 200) {
                            if (response.statusCode === 401) {
                                reject('User is not authenticated');
                            } else {
                                reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                            }
                        } else if (error) {
                            reject('Error connection to ' + url);
                        } else {
                            resolve(body.data);
                        }
                    } else {
                        reject('Error connection to ' + url);
                    }
                }
            )

        } catch (e) {
            reject('Error: ' + e.message);
        }
    });

}

// Executes visitor on the object and its children (recursively).
export function traverse(object, visitor) {

    visitor(object);

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

export function traverseWithResult(object, visitor, result) {

    let _result = visitor(object, result);

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverseWithResult(child, visitor, _result);
            }
        }
    }
}

export function traverseModel(node, visitor){
    visitor(node);

    if(node.children && node.children.length > 0){
        node.children.forEach( child => {
            traverseModelWithResult(child, visitor);
        });
    }
}

export function traverseModelWithResult(node, visitor, result){
    let _result = visitor(node, result);

    if(node.children && node.children.length > 0){
        node.children.forEach( child => {
            traverseModelWithResult(child, visitor, _result);
        });
    }
}

export function parse(inputData, options = {tolerant: true, range: false, comment: true}){
    return esprima.parse(inputData, options);
}

export function generate(ast){
    return escodegen.generate(ast, {comment: true});
}

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

export function writeFile(filePath, fileData){
    return new Promise((resolve, reject) => {
        if(!fileData){
            reject('File data is undefined. File path: ' + filePath);
        }
        fs.ensureFile(filePath, err => {
            if(err){
                reject(err);
            } else {
                fs.writeFile(filePath, fileData, {encoding: 'utf8'}, err => {
                    if(err){
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

export function writeErrorFileFor(outputFilePath, fileData){
    const errorDirPath = path.dirname(outputFilePath);
    const errorFilePath = path.join(errorDirPath, '$errorParsingFile.js');
    writeFile(errorFilePath, fileData);
    return errorFilePath;
}

