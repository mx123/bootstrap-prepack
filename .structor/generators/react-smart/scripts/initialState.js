
import _ from 'lodash';
import path from 'path';
import * as utils from './commons/utils.js';
import * as initialStateUtils from './commons/initialStateUtils.js';
import api from './commons';


export function process(dataObject){

    const { modules, meta } = dataObject;

    return Promise.resolve().then( () => {

        return utils.readFile(modules.initialState.outputFilePath);

    }).then( fileData => {

        let result;
        if(meta.component.stateToProps && meta.component.stateToProps.length > 0){
            const initialStateAst = utils.parse(fileData);
            let initialStateAstNode = initialStateUtils.findInitialStateNode(initialStateAst);
            if(!initialStateAstNode){
                throw Error('Initial state object was not found in ' + modules.initialState.outputFilePath);
            }
            const metaStateAst = utils.parse('const ' + meta.component.stateToProps + '=meta;');
            initialStateUtils.mergeInitialStateWithMeta(initialStateAstNode, metaStateAst);
            result = utils.generate(initialStateAst);
        } else {
            result = fileData;
        }
        console.log(result);

        return result;

    });

}

