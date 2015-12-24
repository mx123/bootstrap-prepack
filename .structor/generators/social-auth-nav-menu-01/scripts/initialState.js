import { readFile, fetch } from './commons/utils.js';

export function process(dataObject){
    const { modules } = dataObject;
    return readFile(modules.initialState.outputFilePath).then( fileData => {
        dataObject.modules.initialState.fileData = fileData;
        return fetch(
            'http://localhost:8080/gengine/process',
            {
                generatorName: 'social-auth-nav-menu-01',
                scriptName: 'initialState.js',
                options: dataObject
            }
        );
    });
}
