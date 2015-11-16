import _ from 'lodash';
import path from 'path';
import { readFile, parse, generate, formatJs } from './commons/utils.js';
import { findInitialStateNode, mergeInitialStateWithMeta } from './initialState/initialStateFile.js';

export function process(dataObject){

    const { modules, meta: { component: { stateToProps } } } = dataObject;

    return Promise.resolve().then( () => {

        return readFile(modules.initialState.outputFilePath);

    }).then( fileData => {

        if(stateToProps && stateToProps.length > 0){

            let initialStateAst;
            try {
                initialStateAst = parse(fileData);
            } catch (e) {
                throw Error('Parsing file: ' + modules.initialState.outputFilePath + '. ' + e);
            }

            let initialStateAstNode = findInitialStateNode(initialStateAst);
            if(!initialStateAstNode){
                throw Error('Initial state object was not found in ' + modules.initialState.outputFilePath);
            }

            let metaStateAst;
            try {
                metaStateAst = parse('const ' + stateToProps + '=meta;');
            } catch (e) {
                throw Error('Parsing "component.stateToProps". ' + e);
            }

            mergeInitialStateWithMeta(initialStateAstNode, metaStateAst);

            try {
                return formatJs(generate(initialStateAst));
            } catch (e) {
                throw Error('Generating initial state file. ' + e);
            }

        } else {
            return fileData;
        }

    });

}

