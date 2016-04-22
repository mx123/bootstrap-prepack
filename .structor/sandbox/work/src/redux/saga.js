import {
    fork,
    take
} from 'redux-saga/effects';
import testComponentSaga from '../controllers/TestGroup/TestComponent/sagas.js';
export default function* mainSaga() {
    yield fork(testComponentSaga);
}