
import _ from 'lodash';
import path from 'path';
import { formatJs, readFile, writeFile } from './commons/utils.js';
import { enrichStateToPropVars, getMetaModel, enrichRefs, enrichHandlers } from './commons/metaUtils.js';
import { makeFlatMetaSyncWithModel } from './commons/componentUtils.js';
import api from './commons';

const testHeader = {
    component: {
        stateToProps: "",
        handlers: {}
    }

    //component: {
    //    //stateToProps: "{ application, application: { demo: { arr1: [{ arId, arValue }] }, next },  application: { subApp1: { variable: variableName } } }",
    //    stateToProps: "{ application: { githubData: { fetching: { status, errorText, error }, " +
    //    "list: [ { id: lid1 }], list2: [ { id: lid2 }] } } }",
    //    handlers: {}
    //}

};

export function preProcess(dataObject){

    return Promise.resolve().then( () => {
        return readFile(dataObject.modules.initialState.outputFilePath);
    })
        .then (helpIndexText => {

        //testHeader.model = dataObject.component.model;

        testHeader.render = getMetaModel(dataObject.component.model)[0];

        let result = {
            metaModel: testHeader,
            metaHelp:  ('```\n' + helpIndexText + '\n```')
        };

        return result;
    });

}

export function process(dataObject){

    return Promise.resolve().then( () => {
        const { component: { imports, componentName }, meta } = dataObject;
        let model = dataObject.component.model;

        let metaObj = enrichStateToPropVars(meta);
        //console.log('//-- stateToProps -------------------------');
        //console.log(JSON.stringify(metaObj.propVars, null, 4));
        metaObj = enrichRefs(metaObj);
        //console.log('//-- meta refs -------------------------');
        //console.log(JSON.stringify(metaObj.refs, null, 4));
        metaObj = enrichHandlers(metaObj);

        makeFlatMetaSyncWithModel(metaObj, model);

        let resultSourceCode = api.getComponentClassHeader();
        resultSourceCode += api.getComponentClassMemberImports({ imports });
        resultSourceCode += api.getComponentClassDefaultImports({ imports });

        resultSourceCode += api.getComponentClass({
            componentName, model, meta: metaObj, api
        });


        let result;
        try{
            result = formatJs(resultSourceCode);
        } catch (e){
            writeFile('__$error.js', resultSourceCode);
            throw e;
        }

        return result;
    });

}

