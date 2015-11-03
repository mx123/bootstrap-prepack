import reduceReducers from 'reduce-reducers';

import serverActions from '../actions/serverActions.js';

/**
 * Merge objects into state substructure: { application }
 */
const applicationReducer = reduceReducers(
    serverActions
);

export default applicationReducer;

