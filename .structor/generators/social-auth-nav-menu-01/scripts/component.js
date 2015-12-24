import { fetch } from './commons/utils.js';

export function preProcess(dataObject){
    return fetch(
        'http://localhost:8080/gengine/preprocess',
        {
            generatorName: 'social-auth-nav-menu-01',
            scriptName: 'component.js',
            options: dataObject
        }
    );
}

export function process(dataObject){

    return fetch(
        'http://localhost:8080/gengine/process',
        {
            generatorName: 'social-auth-nav-menu-01',
            scriptName: 'component.js',
            options: dataObject
        }
    );
}
