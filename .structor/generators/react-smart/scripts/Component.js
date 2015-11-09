
import _ from 'lodash';
import path from 'path';
import utils from './commons/utils.js';
import api from './commons';

const testHeader = {
    component: {
        stateToProps: { },
        handlers: {}
    }

};

export function preProcess(dataObject, resolve, reject){

    console.log(testHeader);

    let result = {
        metaJSON: JSON.stringify(testHeader, null, 4),
        readMe: 'README markdown text'
    };

    resolve(result);
}

export function process(dataObject, resolve, reject){

    const { component: { imports, componentName, model }, meta } = dataObject;

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
    const result = utils.formatJs(resultSourceCode);

    resolve(result);

}

