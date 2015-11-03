import React, {Component} from 'react';
import * as ReactBootstrap from 'react-bootstrap';

class Nav extends Component {

    renderChildren(){
        let eventKeyCount = 0;
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {eventKey: ++eventKeyCount});
        });
    }

    render(){
        return (
            <ReactBootstrap.Nav {...this.props}>
                {this.renderChildren()}
            </ReactBootstrap.Nav>
        );
    }
}

export default Nav;
