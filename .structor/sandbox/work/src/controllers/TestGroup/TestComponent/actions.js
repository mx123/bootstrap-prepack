import { bindActionCreators } from 'redux';

export const EXAMPLE_ACTION_1 = "TestComponent/EXAMPLE_ACTION_1";
export const EXAMPLE_ACTION_2 = "TestComponent/EXAMPLE_ACTION_2";
export const EXAMPLE_ACTION_3 = "TestComponent/EXAMPLE_ACTION_3";

export const exampleAction_1 = () => ({
    type: EXAMPLE_ACTION_1
});

export const exampleAction_2 = (arg1) => ({
    type: EXAMPLE_ACTION_2,
    payload: {
        arg1
    }
});

export const exampleAction_3 = (arg1, arg2) => (dispatch, getState) => {
    dispatch({
        type: EXAMPLE_ACTION_3,
        payload: {
            arg1,
            arg2
        }
    });
};

export const containerActions = (dispatch) => bindActionCreators({
    exampleAction_1,
    exampleAction_2,
    exampleAction_3
}, dispatch);
