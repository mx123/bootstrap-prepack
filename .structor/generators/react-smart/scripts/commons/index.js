import {
    getComponentClassHeader,
    getComponentClassMemberImports,
    getComponentClassDefaultImports,
    getComponentClass,
    getStateVars,
    getRenderVars,
    getClassFooter
} from './componentClass.js';

import {
    getComponentChildren,
    getChildComponent,
    getComponentChildrenVars,
    getRootComponent
} from './componentChildren.js';

import {
    getComponentProps,
    getPropValue,
    getJSXPropValue
} from './componentProps.js';

import {
    getComponentVars,
    fillLocalVars,
    getLocalVarValue,
    getVarValue
} from './componentVars.js';

export default {
    getComponentClassHeader,
    getComponentClassMemberImports,
    getComponentClassDefaultImports,
    getComponentClass,
    getStateVars,
    getRenderVars,
    getClassFooter,
    getComponentChildren,
    getChildComponent,
    getRootComponent,
    getComponentChildrenVars,
    getComponentProps,
    getPropValue,
    getJSXPropValue,
    getComponentVars,
    fillLocalVars,
    getLocalVarValue,
    getVarValue
}
