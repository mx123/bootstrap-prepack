import _ from 'lodash';

const actionsFileTemplate = _.template(
`import { createAction, handleActions } from '../reduxActionsSequence';

const AUTH_WITH = 'AUTH_WITH';
const LOGOUT = 'LOGOUT_FACEBOOK';
<% if(meta.googlePlusClientId) {%>
const CALLBACK_FOR_GOOGLE = 'CALLBACK_FOR_GOOGLE';
<%}%>
const payloadTemplate = {
    error: null,
    provider: null,
    userId: null,
    userName: null,
    userEmail: null,
    token: null
};

const providersAuthMap = {
<% if(meta.facebookClientId) {%>
    facebook: (payload, dispatch) => {
        return new Promise((resolve, reject) => {
            FB.login( loginResponse => {
                if (loginResponse.authResponse && loginResponse.authResponse.accessToken) {
                    FB.api('/me?fields=id,name,email', response => {
                        payload = {
                            token: loginResponse.authResponse.accessToken,
                            provider: 'facebook',
                            userId: response.id,
                            userEmail: response.email,
                            userName: response.name
                        };
                        resolve(payload);
                    });
                } else {
                    payload = {
                        error: 'Login is failed for some reason.'
                    };
                    reject(payload);
                }
            }, {scope: 'public_profile,email'});
        });
    }<% if(meta.googlePlusClientId) {%>,<%}%>
<%}%><% if(meta.googlePlusClientId) {%>
    googlePlus: (payload, dispatch) => {
        return new Promise((resolve, reject) => {
            try {
                gapi.auth.authorize(
                    {
                        client_id: '<%= meta.googlePlusClientId %>',
                        scope: [
                            'https://www.googleapis.com/auth/plus.me',
                            'https://www.googleapis.com/auth/userinfo.email'
                        ],
                        immediate: false
                    },
                    (authResult) => {
                        dispatch(callbackForGoogle(authResult));
                    }
                );
                resolve(payload);
            } catch (e) {
                payload = {
                    error: e.message
                };
                reject(payload);
            }
        });
    }
<%}%>
};

const providersLogoutMap = {
<% if(meta.facebookClientId) {%>
    facebook: (payload) => {
        return new Promise((resolve, reject) => {
            FB.logout(function (response) {
                resolve(payload);
            });
        });
    }<% if(meta.googlePlusClientId) {%>,<%}%>
<%}%><% if(meta.googlePlusClientId) {%>
    googlePlus: (payload) => {
        return Promise.resolve(payload);
    }
<%}%>
};
<% if(meta.googlePlusClientId) {%>
const callbackForGoogle = createAction(CALLBACK_FOR_GOOGLE, authResult => {
    let payload = Object.assign({}, payloadTemplate);
    if (authResult && !authResult.error) {
        return gapi.client.load('plus', 'v1').then(() => {
            var request = gapi.client.plus.people.get({
                'userId': 'me'
            });
            return request.then(
                resp => {
                    let email = null;
                    const { id, emails, displayName } = resp.result;
                    if (emails && emails.length > 0) {
                        email = emails[0].value;
                    }
                    payload = {
                        token: gapi.auth.getToken().access_token,
                        provider: 'googlePlus',
                        userId: id,
                        userEmail: email,
                        userName: displayName
                    };
                    return payload;
                },
                reason => {
                    payload = {
                        error: reason.result.error.message
                    };
                    return payload;
                }
            );
        });
    } else {
        payload = {
            error: authResult.error
        };
        return Promise.reject(payload);
    }
});
<%}%>
export const authWith = createAction(AUTH_WITH, (provider, dispatch) => {

    let payload = Object.assign({}, payloadTemplate);

    if(providersAuthMap[provider]){
        return providersAuthMap[provider](payload, dispatch);
    } else {
        payload = {
            error: 'There is no such provider. Please check providers list in initialState'
        };
        return Promise.reject(payload);
    }

});
export const logout = createAction(LOGOUT, provider => {

    let payload = Object.assign({}, payloadTemplate);
    if(providersLogoutMap[provider]){
        return providersLogoutMap[provider](payload);
    } else {
        payload = {
            error: 'There is no such provider. Please check providers list in initialState'
        };
        return Promise.reject(payload);
    }

});

export default handleActions({

    [AUTH_WITH]: {
        start(state, action) {
            state = Object.assign({}, state, payloadTemplate);
            state.requestStage = 'start';
            return state;
        },
        next(state, action) {
            state = Object.assign({}, state, action.payload);
            state.requestStage = 'done';
            return state;
        },
        throw(state, action) {
            state = Object.assign({}, state, payloadTemplate, {
                requestStage: 'done',
                error: action.payload.error ? action.payload.error : action.payload
            });
            return state;
        }
    },
<% if(meta.googlePlusClientId) {%>
    [CALLBACK_FOR_GOOGLE]: (state, action) => {
        state = Object.assign({}, state, action.payload);
        state.requestStage = 'done';
        return state;
    },
<%}%>
    [LOGOUT]: {
        start(state, action) {
            state = Object.assign({}, state, payloadTemplate);
            state.requestStage = 'start';
            return state;
        },
        next(state, action) {
            state = Object.assign({}, state, action.payload);
            state.requestStage = 'done';
            return state;
        },
        throw(state, action) {
            state = Object.assign({}, state, payloadTemplate, {
                requestStage: 'done',
                error: action.payload.error ? action.payload.error : action.payload
            });
            return state;
        }
    }

}, {});
`);

export function getActionsFile(options){
    return actionsFileTemplate(options);
}