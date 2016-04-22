import { fork, take, call, put, cancel } from 'redux-saga/effects';
import { SagaCancellationException } from 'redux-saga';

import * as actions from './actions.js';

const delay = ms => new Promise(resolve => setTimeout(() => resolve('timed out'), ms));

function* sampleSaga() {
    while (true) {
        console.log('Start');
        const {payload: {arg1, arg2}} = yield take(actions.EXAMPLE_ACTION_3);
        yield put(actions.exampleAction_1());
        try {
            const response = yield call(delay, 3000);
        } catch (e) {
            console.error(e);
        }
        console.log('Finish');
    }
}

// main saga
export default function* mainSaga() {
    yield[fork(sampleSaga)];
}
;
