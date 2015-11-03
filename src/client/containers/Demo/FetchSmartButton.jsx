
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import { fetchServerData } from '../../actions/serverActions.js';

class FetchSmartButton extends Component {

    constructor(props, content) {
        super(props, content);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        e.preventDefault();
        e.stopPropagation();
        this.props.dispatch(fetchServerData());
    }

    render() {
        const { fetching: { status } } = this.props;
        return (
            <Button {...this.props} onClick={this.handleClick}>
                { status === 'loading' ? <span>Loading data...</span> : <span>Fetch server data</span> }
            </Button>
            );
    }
}



function mapStateToProps(state) {
    const { application: { serverData: { fetching } } } = state;
    return {
        fetching
    };
}

export default connect(mapStateToProps)(FetchSmartButton);


