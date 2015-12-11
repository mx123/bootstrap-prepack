import _ from 'lodash';
import path from 'path';
import { readFile, parse, generate, formatJs } from './commons/utils.js';
import { findInitialStateNode, mergeInitialStateWithPart } from './initialState/initialStateFile.js';

export function process(dataObject){

    const { modules, meta } = dataObject;
    const stateToPropsTemplate = _.template(`{
        authentication: {
            requestStage: 'done',
            error: null,
            provider: null,
            userName: null,
            userEmail: null,
            token: null,
            providers: [
            <% if(meta.facebookClientId) {%>
                {
                    key: 'facebook',
                    label: 'Sign in with Facebook'
                }<% if(meta.googlePlusClientId) {%>,<%}%>
            <%}%><% if(meta.googlePlusClientId) {%>
                {
                    key: 'googlePlus',
                    label: 'Sign in with GooglePlus'
                }
            <%}%>
            ]
        }
    }`);

    const stateToProps = stateToPropsTemplate({meta});

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

            let partStateAst;
            try {
                partStateAst = parse('const part = ' + stateToProps + ';');
            } catch (e) {
                throw Error('Parsing "' + stateToProps + '". ' + e);
            }

            mergeInitialStateWithPart(initialStateAstNode, partStateAst);

            let resultSourceCode = generate(initialStateAst);
            try {
                return formatJs(resultSourceCode);
            } catch (e) {
                throw Error(e + ' Please look at file: ' + writeErrorFileFor(modules.initialState.outputFilePath, resultSourceCode));
            }

        } else {
            return fileData;
        }

    });

}

