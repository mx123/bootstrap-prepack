
import _ from 'lodash';
import path from 'path';
import { formatJs, readFile } from './commons/utils.js';
import { parseMeta } from './commons/metaUtils.js';
import { getMetaModel } from './commons/componentUtils.js';
import api from './commons';

const testHeader = {
    component: {
        stateToProps: "{ application,  application: { subApp1: { variable: variableName } } }",
        handlers: {}
    }

};

export function preProcess(dataObject){

    return Promise.resolve().then( () => {
        console.log(testHeader);

        //testHeader.model = dataObject.component.model;

        testHeader.render = getMetaModel(dataObject.component.model);

        let result = {
            metaJSON: JSON.stringify(testHeader, null, 4),
            readMe: 'README markdown text'
        };

        return result;
    });

}

export function process(dataObject){

    return Promise.resolve().then( () => {
        const { component: { imports, componentName, model }, meta } = dataObject;

        const metaObj = parseMeta(meta);

        let resultSourceCode = api.getComponentClassHeader();
        resultSourceCode += api.getComponentClassMemberImports({ imports });
        resultSourceCode += api.getComponentClassDefaultImports({ imports });
        resultSourceCode += api.getComponentClass({
            componentName, componentBody: '<span></span>', componentProps: 'props', model, meta, api
        });


        console.log('//---- -------------------- ----//');
        console.log('//---- component dataObject ----//');
        console.log('//---- -------------------- ----//');
        //console.log(JSON.stringify(dataObject, null, 4));
        const result = formatJs(resultSourceCode);

        return result;
    });

}

