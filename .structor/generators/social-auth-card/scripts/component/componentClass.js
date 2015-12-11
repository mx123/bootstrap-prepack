import _ from 'lodash';

const classTemplate = _.template(
`import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';

class <%= meta.componentName %> extends Component {

    constructor(props, content) {
        super(props, content);
    }

    render() {
        const {userId, userName, userEmail, provider} = this.props;
        let providerCode = 'Not signed in';
        if(provider){
            switch (provider) {
                case 'facebook':
                    providerCode = 'Signed with Facebook';
                    break;
                case 'googlePlus':
                    providerCode = 'Signed with GooglePlus';
                    break;
                default:
                    break;
            }
        }
        let userNameId = userId ? userId : 'None';
        let userNameValue = userName ? userName : 'None';
        let userEmailValue = userEmail ? userEmail : 'None';
        return (<Panel
                       {...this.props}
                       header={ providerCode }
                       bsStyle="primary">
                    <p
                       className="text-muted "
                       style={ {    "marginBottom": 0} }>
                        <span>ID:</span>
                    </p>
                    <p style={ {    "marginTop": 0} }>
                        <span>{ userNameId }</span>
                    </p>
                    <p
                       className="text-muted "
                       style={ {    "marginBottom": 0} }>
                        <span>Name:</span>
                    </p>
                    <p style={ {    "marginTop": 0} }>
                        <span>{ userNameValue }</span>
                    </p>
                    <p
                       className="text-muted"
                       style={ {    "marginBottom": 0} }>
                        <span>E-mail:</span>
                    </p>
                    <p style={ {    "marginTop": 0} }>
                        <span>{ userEmailValue }</span>
                    </p>
                </Panel>
            );
    }
}
function mapStateToProps(state) {
    const {authentication: {userId, userName, userEmail, provider}} = state;
    return {
        userId,
        userName,
        userEmail,
        provider
    };
}

export default connect(mapStateToProps)(<%= meta.componentName %>);

`);

export function getComponentClass(options){
    return classTemplate(options);
}