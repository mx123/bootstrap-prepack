import * as actions from './actions.js';

const initialState = {
    arg1: undefined,
    arg2: undefined
};

export default (state = initialState, action = {}) => {

    const {type, payload} = action;

    if (type === actions.EXAMPLE_ACTION_1) {
        return Object.assign({}, state, {});
    }

    if (type === actions.EXAMPLE_ACTION_2) {
        return Object.assign({}, state, {
            arg1: payload.arg1
        });
    }

    if (type === actions.EXAMPLE_ACTION_3) {
        return Object.assign({}, state, {
            arg1: payload.arg1,
            arg2: payload.arg2
        });
    }

    return state;
}

