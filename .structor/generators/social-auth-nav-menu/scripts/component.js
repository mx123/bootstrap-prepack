import path from 'path';
import _ from 'lodash';
import { formatJs, readFile, writeFile, writeErrorFileFor } from './commons/utils.js';
import { getComponentClass } from './component/componentClass.js';

export function preProcess(dataObject){

    return Promise.resolve()
        .then( () => {

            if(dataObject.component.model.type !== 'NavDropdown' && dataObject.component.model.type !== 'NavItem'){
                throw Error('Root component type of the composition model must be NavDropdown or NavItem');
            }

            return readFile(path.join(dataObject.generator.dirPath, 'readme.md'));
        })
        .then (readmeFile => {
            return {
                metaModel: {
                    facebookClientId: null,
                    googlePlusClientId: null
                },
                metaHelp:  readmeFile
            };
        });

}

export function process(dataObject){

    return Promise.resolve().then( () => {
        const { component: { model, outputFilePath, imports, componentName }, modules, meta } = dataObject;

        const metaObj = Object.assign({}, meta, {
            actionsIndexFilePath: modules.actionsIndex.relativeFilePath,
            componentName: componentName
        });

        let resultSourceCode = getComponentClass({meta: metaObj});

        try{
            return formatJs(resultSourceCode);
        } catch (e){
            throw Error(e + ' Please look at file: ' + writeErrorFileFor(outputFilePath, resultSourceCode));
        }
    });

}

