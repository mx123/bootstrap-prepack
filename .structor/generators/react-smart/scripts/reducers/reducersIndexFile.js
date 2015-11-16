import _ from 'lodash';
import { traverse } from '../commons/utils.js';

export function findDefaultExportNode(ast){
    let result = null;
    traverse(ast, node => {
        if (node.type === 'ExportDefaultDeclaration'
            && node.declaration){
            if(node.declaration.type === 'Identifier'){
                const defaultExportVarName = node.declaration.name;
                traverse(ast, function(innerNode){
                    if(innerNode.type === 'VariableDeclarator'
                        && innerNode.id
                        && innerNode.id.type === 'Identifier' && innerNode.id.name === defaultExportVarName){
                        result = innerNode.init;
                    }
                });
            } else if(node.declaration.type === 'ObjectExpression'){
                result = node.declaration;
            }
        }
    });
    return result;
}

export function injectNonExistingReducer(ast, meta, componentName, actionsFilePath) {
    const defaultNodeAst = findDefaultExportNode(ast);
    if (!meta.component.reducerRoot || meta.component.reducerRoot.length <= 0) {
        throw Error('Reducer root was not specified');
    }
    const reducerName = _.camelCase(componentName + "Reducer");
    if (ast.body) {
        ast.body.splice(0, 0, {
            type: 'ImportDeclaration',
            specifiers: [
                {
                    type: "ImportDefaultSpecifier",
                    local: {
                        type: "Identifier",
                        name: reducerName
                    }
                }
            ],
            "source": {
                "type": "Literal",
                "value": actionsFilePath,
                "raw": '\'' + actionsFilePath + '\''
            }
        });
    }
    if (defaultNodeAst.callee
        && defaultNodeAst.callee.name === 'combineReducers'
        && defaultNodeAst.arguments
        && defaultNodeAst.arguments[0].properties) {

        if (defaultNodeAst.arguments[0].properties.length > 0) {
            defaultNodeAst.arguments[0].properties.forEach(prop => {
                if (prop.key && prop.key.name === meta.component.reducerRoot) {
                    throw Error('Specified reducer root is already exists for ' + prop.value.name);
                }
            });
        }

        defaultNodeAst.arguments[0].properties.splice(0, 0, {
            type: "Property",
            key: {
                type: "Identifier",
                name: meta.component.reducerRoot
            },
            computed: false,
            value: {
                type: "Identifier",
                name: reducerName
            },
            kind: "init",
            method: false,
            shorthand: false
        });

    } else {
        throw Error('Could not find "combineReducers" function in reducers index file or it has wrong call expression');
    }
    return ast;
}

