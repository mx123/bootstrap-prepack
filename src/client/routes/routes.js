'use strict';

import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';
import HomePage from './HomePage.js';

export default function() {
    const history = createHistory();
    return (
        <Router history={ history }>
            <Route path="/" component="div">
                <IndexRoute component={ HomePage } />
                <Route path="/home" component={ HomePage } />
            </Route>
        </Router>
        );
}