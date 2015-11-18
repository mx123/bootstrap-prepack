import _ from 'lodash';

const asyncActionHandler = _.template(
`[<%= action.constantName %>]: {
    start(state, action){
        state = Object.assign({}, state, {
            status: {
                code: 'start',
                text: 'Started'
            },
            result: null
        });
        return state;
    },
    next(state, action){
        state = Object.assign({}, state, {
            status: {
                code: 'done',
                text: 'Completed successfully'
            },
            result: action.payload
        });
        return state;
    },
    throw(state, action){
        state = Object.assign({}, state, {
            status: {
                code: 'error',
                text: 'Completed with error: ' + action.payload
            },
            result: null
        });
        return state;
    }
}`);

const actionHandler = _.template(
`[<%= action.constantName %>]: (state, action) => {
    state = Object.assign({}, state, {
        result: action.payload
    });
    return state;
}`);

const asyncActionReturn = _.template(
`return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({});
    }, 3000);
});\n`);

const actionReturn = _.template(
`return {};\n`);

const newAction = _.template(
`export const <%= action.actionName %> = createAction(<%= action.constantName %>, <%= api.getActionParameters({ action: action }) %> => {
    <%= api.getActionReturnObject({ action: action }) %>});\n`);

const actionsWrapper = _.template(
`import { createAction, handleActions } from '../reduxActionsSequence';

<%= api.getActionsConstants({ newActions: newActions }) %>
<%= api.getActionsCreators({ newActions: newActions, api: api }) %>
export default handleActions({

    <%= api.getActionsHandlers({ newActions: newActions }) %>

}, {});\n`);

export function getActionsHandlers(options){
    const { newActions } = options;
    let result = '';
    newActions.forEach( (action, name) => {
        if(action.label && action.label === 'async'){
            result += asyncActionHandler({ action }) + ',';
        } else {
            result += actionHandler({ action }) + ',';
        }
    });
    result = result.substr(0, result.length - 1);
    return result;
}

export function getActionsConstants(options){
    const { newActions } = options;
    let result = '';
    newActions.forEach( (action, name) => {
        result += 'const ' + action.constantName + ' = \'' + action.constantName + '\';\n';
    });
    return result;
}

export function getActionsCreators(options){
    const { newActions, api } = options;
    let result = '';
    newActions.forEach( (action, name) => {
        result += newAction({ api, action });
    });
    return result;
}

export function getActionParameters(options){
    const { action } = options;
    if(action.arguments.length === 0){
        return '()';
    }
    let paramsText = '';
    action.arguments.forEach( argument => {
        if(argument.ref){
            paramsText += argument.ref + ',';
        } else if(argument.propVar){
            paramsText += argument.propVar + ',';
        } else if(argument.argumentName){
            paramsText += argument.argumentName + ',';
        }
    });
    paramsText = paramsText.substr(0, paramsText.length - 1);
    if(action.arguments.length > 1){
        return '(' + paramsText + ')';
    } else {
        return paramsText;
    }
}

export function getActionReturnObject(options){
    const { action } = options;
    if(action.label && action.label === 'async'){
        return asyncActionReturn();
    } else {
        return actionReturn();
    }
}

export function getActionsFile(options){
    return actionsWrapper(options);
}
