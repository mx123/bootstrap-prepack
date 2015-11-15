import { parse, traverse, traverseWithResult } from './utils.js';

function getObjectAstMap(ast){
    const result = new Map();
    let nodeStore = {
        key: '0'
    };
    traverseWithResult(ast, (node, res) => {
        if( node.type === 'Property' && node.key && node.key.type === 'Identifier' && node.value){
            if(node.value.type === 'ObjectExpression' || node.value.type === 'ArrayExpression'){
                let key = res.key + '.' + node.key.name;
                //console.log('Key: ' + key);
                res[node.key.name] = {
                    key: key
                };
                result.set(key, { parentKey: res.key, node });
                return res[node.key.name];
            } else if(node.value.type === 'Literal') {
                let key = res.key + '.' + node.key.name;
                //console.log('Key: ' + key);
                res[node.key.name] = {
                    key: key
                };
                result.set(key, { parentKey: res.key, node });
                return res;
            }
        }
        return res;
    }, nodeStore);

    return result;
}

//function getMetaStateMap(ast){
//    const result = new Map();
//    let nodeStore = {
//        key: '0'
//    };
//
//    traverseWithResult(ast, (node, res) => {
//        if( node.type === 'Property' && node.key && node.key.type === 'Identifier' && node.value){
//            if(node.value.type === 'ObjectPattern' || node.value.type === 'ArrayPattern'){
//                let key = res.key + '.' + node.key.name;
//                res[node.key.name] = {
//                    key: key
//                };
//                result.set(key, { parentKey: res.key, node });
//                return res[node.key.name];
//            } else if(node.value.type === 'Identifier'){
//                let key = res.key + '.' + node.key.name;
//                res[node.value.name] = {
//                    key: key
//                };
//                result.set(key, { parentKey: res.key, node });
//                return res;
//            }
//        }
//        return res;
//    }, nodeStore);
//
//    return result;
//}

function transformRestructuringToObject(ast){
    traverse(ast, node => {
        if( node.type === 'Property' && node.key && node.key.type === 'Identifier' && node.value) {
            if(node.value.type === 'ObjectPattern'){
                node.value.type = 'ObjectExpression';
            } else if(node.value.type === 'ArrayPattern'){
                node.value.type = 'ArrayExpression'
            } else if(node.value.type === 'Identifier'){
                node.value = {
                    type: 'Literal',
                    value: null,
                    raw: 'null'
                };
                node.shorthand = false;
            }
        }
    });
}

function mergeMetaAstToInitialAst(metaMap, initialMap){
    metaMap.forEach( (value, key, thisMap) => {
        //console.log('Meta ast key: ' + key);
        let initialEntry = initialMap.get(key);
        if(initialEntry){
            //console.log('Entries types: ', value.node.value.type, initialEntry.node.value.type);
        } else {
            let initialParentEntry = initialMap.get(value.parentKey);
            if(initialParentEntry){
                let metaParentEntry = thisMap.get(value.parentKey);
                //console.log('Parent entries types: ', metaParentEntry.node.value.type, initialParentEntry.node.value.type);
                //console.log(JSON.stringify(value.node, null, 4));
                //console.log(JSON.stringify(metaParentEntry.node, null, 4));
                if(initialParentEntry.node.value.type === 'ArrayExpression'){
                    let elements = initialParentEntry.node.value.elements;
                    if(elements && elements.length > 0){
                        elements.forEach( element => {
                            if(element.type === 'ObjectExpression'){
                                element.properties.push(value.node);
                            }
                        });
                    }
                } else if(initialParentEntry.node.value.type === 'ObjectExpression') {
                    initialParentEntry.node.value.properties.push(value.node);
                }
                //console.log(JSON.stringify(metaParentEntry.node, null, 4));
            }
        }
    });
}

export function findInitialStateNode(ast){
    let result = null;
    let defaultExportVarName = null;
    traverse(ast, node => {
        if (node.type === 'ExportDefaultDeclaration'
            && node.declaration
            && node.declaration.type === 'Identifier') {
            defaultExportVarName = node.declaration.name;
        }
    });

    if(defaultExportVarName){
        traverse(ast, function(node){
            if(node.type === 'VariableDeclarator'
                && node.id
                && node.id.type === 'Identifier' && node.id.name === defaultExportVarName){
                result = node.init;
            }
        });
    }
    return result;
}

export function mergeInitialStateWithMeta(initialStateAstNode, metaStateAst){

    //console.log(JSON.stringify(metaStateAst, null, 4));
    transformRestructuringToObject(metaStateAst);
    let metaStateMap = getObjectAstMap(metaStateAst);
    let initialStateMap = getObjectAstMap(initialStateAstNode);

    //let metaStateAst = parse(metaStateObj);

    //console.log('=====================================================================================================');
    mergeMetaAstToInitialAst(metaStateMap, initialStateMap);
    //console.log(JSON.stringify(metaStateMap, null, 4));
    //console.log('=====================================================================================================');
    //console.log(JSON.stringify(initialStateMap, null, 4));
    //console.log(JSON.stringify(initialStateAstNode, null, 4));

}
