
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


class SmartPanel extends Component {

    constructor(props, content) {
        super(props, content); // this.state = {count: props.initialCount};
    }

    render() {
        const { serverData: { fetching: { status, error, errorText }, list } } = this.props;
        let content = null;
        if(status === 'loading'){
            content = ( <p {...this.props}><span>Loading...</span></p> );
        } else if(status === 'done') {
            if(error){
                content = ( <p {...this.props}><span>{'Error: ' + errorText}</span></p> );
            } else {
                if(list && list.length > 0){
                    const contentList = list.map( item => {
                        return ( <p key={item.id} {...this.props}><span>{'Name: ' + item.name + ', email: ' + item.email}</span></p> );
                    });
                    content = ( <div>{contentList}</div> )
                } else {
                    content = ( <p {...this.props}><span>{'No data'}</span></p> );
                }
            }
        }
        return content;
    }
}

function mapStateToProps(state) {
    const { application: { serverData } } = state;
    return {
        serverData
    };
}

export default connect(mapStateToProps)(SmartPanel);


