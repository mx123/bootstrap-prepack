import React, { Component, PropTypes } from 'react';
import { ADD_BEFORE, ADD_AFTER, } from './SelectedOverlay.js';

class QuickAddNewOverlay extends Component {

    constructor(props) {
        super(props);
        this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    }

    componentDidMount(){
        //this.refs.inputElement.addEventListener('change', ((inputElm) => () => {
        //    let optionFound = false;
        //    let datalist = inputElm.list;
        //    for (let j = 0; j < datalist.options.length; j++) {
        //        if (inputElm.value == datalist.options[j].value) {
        //            optionFound = true;
        //            break;
        //        }
        //    }
        //    if (optionFound) {
        //        inputElm.setCustomValidity('');
        //    } else {
        //        inputElm.setCustomValidity('Type full component name.');
        //    }
        //})(this.refs.inputElement));
        this.refs.inputElement.focus();
    }

    handleOnKeyDown(e){
        if(e.keyCode == 27){
            this.props.onClose();
        }
    }

    render() {
        let boxStyle = {
            display: 'inline-block'
        };
        let content = (
            <div style={boxStyle} className="selected-overlay-quick-add-panel">
                <div className="selected-overlay-quick-add-close-button"
                     onClick={() => {this.props.onClose();}}>X</div>
                <form onSubmit={(e) => {e.stopPropagation(); e.preventDefault(); alert('Submit selection');}}>
                    <span style={{color: '#9a9a9a'}}>{this.props.menuTitle}</span>
                    <input ref="inputElement"
                           type="text"
                           autocomplete="on"
                           list="components"
                           onKeyDown={this.handleOnKeyDown}
                           className="selected-overlay-quick-add-input" />
                    <span style={{color: '#9a9a9a'}}>{this.props.menuSubTitle}</span>
                    <datalist id="components">
                        <option>div</option>
                        <option>table</option>
                        <option>Table</option>
                        <option>Panel</option>
                        <option>PanelSignInOut</option>
                        <option>AutoSignIn</option>
                    </datalist>
                </form>
            </div>
        );
        return (
            <div {...this.props}>
                {content}
            </div>
        );
    }
}

export default QuickAddNewOverlay;
