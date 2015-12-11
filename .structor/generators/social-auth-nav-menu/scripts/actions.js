
import _ from 'lodash';
import path from 'path';
import { readFile, parse, generate, formatJs, writeErrorFileFor } from './commons/utils.js';
import { getNonExistingActions } from './actionsIndex/actionsUtils.js';
import { getActionsFile } from './actions/actionsFile.js';

export function process(dataObject){

    const { modules, meta } = dataObject;

    return Promise.resolve().then( () => {

        return readFile(modules.actionsIndex.outputFilePath);

    }).then( fileData => {

        const ast = parse(fileData);
        const actionsMap = new Map();
        actionsMap.set('authWith', true);
        actionsMap.set('logout', true);
        const nonExistingActionsMap = getNonExistingActions(ast, actionsMap);

        if(nonExistingActionsMap.size > 0){
            let resultSourceCode = getActionsFile({ meta });
            try{
                return formatJs(resultSourceCode);
            } catch (e){
                throw Error(e + ' Please look at file: ' + writeErrorFileFor(modules.actions.outputFilePath, resultSourceCode));
            }
        } else {
            return '';
        }

    });

}

