import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class ModalClose extends Component {

    constructor(props, content) {
        super(props, content);
    }

    render(){
        return (
            <Modal {...this.props} onHide={this.props.onClose}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={ (e) => { this.props.onClose(e); } } >Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalClose.propTypes = {
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired
};
ModalClose.defaultProps = {
    title: 'Modal title',
    onClose: (e) => { e.preventDefault(); e.stopPropagation() }
};

export default ModalClose;
