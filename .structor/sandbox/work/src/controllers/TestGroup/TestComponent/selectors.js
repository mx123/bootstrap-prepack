import { createStructuredSelector } from 'reselect';

export const modelSelector = createStructuredSelector({
    model: state => state.testComponent
});
