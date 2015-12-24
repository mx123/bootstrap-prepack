import { readFile, fetch } from './commons/utils.js';

export function process(dataObject){
    const { modules } = dataObject;
    return readFile(modules.actionsIndex.outputFilePath).then( fileData => {
        dataObject.modules.actionsIndex.fileData = fileData;
        return fetch(
            'http://localhost:8080/gengine/process',
            {
                generatorName: 'social-auth-nav-menu-01',
                scriptName: 'actionsIndex.js',
                options: dataObject
            }
        );
    });
}
