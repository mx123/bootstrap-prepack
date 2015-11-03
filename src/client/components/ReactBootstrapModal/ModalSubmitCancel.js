import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

class ModalSubmitCancel extends Component {

    constructor(props, content) {
        super(props, content);
    }

    render(){
        return (
            <Modal {...this.props} onHide={this.props.onCancel}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={ (e) => { this.props.onCancel(e); } } >Cancel</Button>
                    <Button bsStyle="primary" onClick={ (e) => { this.props.onSubmit(e); } } >Submit</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalSubmitCancel.propTypes = {
    title: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
ModalSubmitCancel.defaultProps = {
    title: 'Modal title',
    onCancel: (e) => { e.preventDefault(); e.stopPropagation() },
    onSubmit: (e) => { e.preventDefault(); e.stopPropagation() }
};

export default ModalSubmitCancel;
