
import _ from 'lodash';
import path from 'path';
import { formatJs, readFile, writeFile } from './commons/utils.js';
import { enrichStateToPropVars, getMetaModel, enrichRefs, enrichHandlers } from './commons/metaUtils.js';
import { makeFlatMetaSyncWithModel } from './component/componentUtils.js';
import { getComponentClass } from './component/componentClass.js';
import * as api from './component/index.js';

const testHeader = {
    component: {
        stateToProps: '',
        handlers: {
            componentWillReceiveProps: '(nextProps) => {}',
            componentWillUpdate: '(nextProps, nextState) => {}',
            componentDidMount: '() => {}'
        }
    }
};

export function preProcess(dataObject){

    return Promise.resolve().then( () => {
        return readFile(dataObject.modules.initialState.outputFilePath);
    })
        .then (helpIndexText => {

        testHeader.component.reducerRoot =  _.camelCase(dataObject.component.componentName);
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
        const { component: { imports, componentName }, modules, meta } = dataObject;
        let model = dataObject.component.model;

        let metaObj = enrichHandlers(enrichRefs(enrichStateToPropVars(meta)));

        metaObj.actionsIndexFilePath = modules.actionsIndex.relativeFilePath;

        makeFlatMetaSyncWithModel(metaObj, model);

        let resultSourceCode = getComponentClass({
            imports, componentName, model, meta: metaObj, api
        });

        try{
            return formatJs(resultSourceCode);
        } catch (e){
            writeFile('__$error.js', resultSourceCode);
            throw e;
        }
    });

}

