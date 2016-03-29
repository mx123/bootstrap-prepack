require("babel-polyfill");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createHistory } from 'history';
import { Router, Route, Link, useRouterHistory } from 'react-router';
import { initStore } from '../require.config.js';
import PageForDesk from './PageForDesk.js';

window.pageReadyState = 'ready';

window.__createPageDesk = function(){

    const history = useRouterHistory(createHistory)({
        basename: '/deskpage'
    });

    window.__switchToPath = function(pagePath){
        history.push(pagePath);
    };

    let routeConfig = [
        { path: '/',
            component: 'div',
            indexRoute: { component: PageForDesk },
            childRoutes: [{ path: '*', component: PageForDesk }]
        }
    ];

    ReactDOM.render(
        <Provider store={initStore()}>
            <Router history={history} routes={routeConfig} />
        </Provider>,
        document.getElementById('content')
    );

    window.pageReadyState = 'initialized';

};

