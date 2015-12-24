import { readFile, fetch } from './commons/utils.js';

export function process(dataObject){
    const { modules } = dataObject;
    return readFile(modules.actionsIndex.outputFilePath).then( fileData => {
        dataObject.modules.actionsIndex.fileData = fileData;
    }).then( () => {
        return readFile(modules.reducersIndex.outputFilePath);
    }).then( fileData => {
        dataObject.modules.reducersIndex.fileData = fileData;
        return fetch(
            'http://localhost:8080/gengine/process',
            {
                generatorName: 'social-auth-nav-menu-01',
                scriptName: 'reducersIndex.js',
                options: dataObject
            }
        );

    });
}
