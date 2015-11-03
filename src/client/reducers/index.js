import {combineReducers} from 'redux';
import applicationReducer from './applicationReducer.js';

const rootReducer = combineReducers({
    application: applicationReducer
});

export default rootReducer;
