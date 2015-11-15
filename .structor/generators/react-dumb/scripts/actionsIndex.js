
import _ from 'lodash';
import path from 'path';
import utils from './commons/utils.js';
import api from './commons';


export function process(dataObject){

    return Promise.resolve().then( () => {
        const { modules, meta } = dataObject;
        //
        //let resultSourceCode = api.getComponentClassHeader();
        //resultSourceCode += api.getComponentClassMemberImports({ imports });
        //resultSourceCode += api.getComponentClassDefaultImports({ imports });
        //resultSourceCode += api.getComponentClass({
        //    componentName, componentBody: '<span></span>', componentProps: 'props', model, api
        //});
        //
        //
        //console.log(resultSourceCode);
        //console.log('//---------//');
        //let result = utils.formatJs(resultSourceCode);

        console.log('//---- ----------------------- ----//');
        console.log('//---- actionsIndex dataObject ----//');
        console.log('//---- ----------------------- ----//');
        //console.log(JSON.stringify(dataObject, null, 4));
        const result = '@@ actionsIndex source code';

        return result;

    });

}

