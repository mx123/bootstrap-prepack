import _ from 'lodash';
import path from 'path';
import { enrichHandlers } from './commons/metaUtils.js';
import { readFile, parse, generate, formatJs } from './commons/utils.js';
import { getNonExistingActions } from './actionsIndex/actionsUtils.js';
import { injectNonExistingReducer } from './reducers/reducersIndexFile.js';

export function process(dataObject){

    const { modules, meta, component: { componentName } } = dataObject;

    return Promise.resolve().then( () => {

        return readFile(modules.actionsIndex.outputFilePath);

    }).then( fileData => {

        const ast = parse(fileData);
        let metaObj = enrichHandlers(meta);
        const nonExistingActionsMap = getNonExistingActions(ast, metaObj.actions);

        return readFile(modules.reducersIndex.outputFilePath).then( fileData => {
            return { fileData, nonExistingActionsMap };
        });

    }).then( resultObj => {

        if(resultObj.nonExistingActionsMap.size > 0){

            let newAst = null;
            try{
                const ast = parse(resultObj.fileData);
                newAst = injectNonExistingReducer(ast, meta, componentName, modules.actions.relativeFilePath);
            } catch(e){
                throw Error('Parsing file: ' + modules.reducersIndex.outputFilePath + '. ' + e);
            }

            let resultSourceCode = generate(newAst);
            try{
                return formatJs(resultSourceCode);
            } catch(e){
                throw Error(e + ' Please look at file: ' + writeErrorFileFor(modules.reducersIndex.outputFilePath, resultSourceCode));
            }

        } else {
            return resultObj.fileData;
        }

    });

}

