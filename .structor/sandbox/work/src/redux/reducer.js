import { combineReducers } from 'redux';
import testComponentReducer from '../controllers/TestGroup/TestComponent/reducer.js';
const reducer = combineReducers({ testComponent: testComponentReducer });
export default reducer;