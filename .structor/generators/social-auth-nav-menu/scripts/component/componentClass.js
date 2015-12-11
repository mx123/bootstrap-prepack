import _ from 'lodash';

const classTemplate = _.template(
`import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MenuItem, NavDropdown } from 'react-bootstrap';
import { authWith, logout  } from '<%= meta.actionsIndexFilePath %>';

class <%= meta.componentName %> extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleAuthWith = this.handleAuthWith.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleAuthWith(e) {
        e.preventDefault();
        e.stopPropagation();
        const {dispatch} = this.props;
        dispatch(authWith(e.currentTarget.dataset.provider, dispatch));
    }
    handleLogout(e) {
        e.preventDefault();
        e.stopPropagation();
        const { dispatch } = this.props;
        const { provider } = e.currentTarget.dataset;
        dispatch(logout(provider));
    }
    componentDidMount(){
        <% if(meta.facebookClientId) {%>
        if (!window.fbAsyncInit) {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '<%= meta.facebookClientId %>',
                    xfbml: true,
                    version: 'v2.5'
                });
            };
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
        <%}%><% if(meta.googlePlusClientId) {%>
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://apis.google.com/js/client.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'google-api'));
        <%}%>
    }

    render() {
        const {
            token,
            requestStage,
            error,
            provider,
            userName,
            providers
            } = this.props;
        let menu = null;
        let title;
        if(requestStage === 'done'){
            if(token){
                menu = (
                    <MenuItem
                        eventKey={1}
                        data-provider={provider}
                        onClick={this.handleLogout}>
                        <span>Logout</span>
                    </MenuItem>
                );
                title = userName;
            } else {
                if(providers && providers.length > 0){
                    menu = providers.map( (provider, index) => {
                        return (
                            <MenuItem key={provider.key} eventKey={index + 1} data-provider={provider.key} onClick={this.handleAuthWith}>
                                <span>{provider.label}</span>
                            </MenuItem>
                        );
                    });
                }
                title = 'Sign In';
            }
        } else {
            title = (<span className='fa fa-spinner fa-pulse fa-fw'></span>);
        }
        if(error){
            console.error(error);
        }
        return (
            <NavDropdown
                id='authNavDropdown'
                title={title}
                eventKey={ 3 }>
                { menu }
            </NavDropdown>
        );
    }
}
function mapStateToProps(state) {
    const {
        authentication: {
            requestStage,
            error,
            provider,
            userName,
            token,
            providers
        }
    } = state;
    return {
        token,
        requestStage,
        error,
        provider,
        userName,
        providers
    };
}

export default connect(mapStateToProps)(<%= meta.componentName %>);
`);

export function getComponentClass(options){
    return classTemplate(options);
}