import _ from 'lodash';
import path from 'path';
import { readFile, parse, generate, formatJs } from './commons/utils.js';
import { injectNonExistingActions } from './actionsIndex/actionsIndexFile.js';

export function process(dataObject){

    const { modules, meta } = dataObject;

    return Promise.resolve().then( () => {

        return readFile(modules.actionsIndex.outputFilePath);

    }).then( fileData => {

        let result = fileData;
        let newAst = null;
        try{
            const ast = parse(fileData);
            const actionsMap = new Map();
            actionsMap.set('authWith', true);
            actionsMap.set('logout', true);
            newAst = injectNonExistingActions(ast, actionsMap, modules.actions.relativeFilePath);
        } catch(e){
            throw Error('Parsing file: ' + modules.actionsIndex.outputFilePath + '. ' + e);
        }

        let resultSourceCode = generate(newAst);
        try{
            result = formatJs(resultSourceCode);
        } catch(e){
            throw Error(e + ' Please look at file: ' + writeErrorFileFor(modules.actionsIndex.outputFilePath, resultSourceCode));
        }

        return result;

    });

}

