import React, { Component, PropTypes } from 'react';

const borderRadius = '2px';
const nullPx = '0px';
const px = 'px';
const position = 'absolute';
const borderStyle = 'solid #35b3ee';
const borderSize = '2px';

function isVisible(element) {
    let invisibleParent = false;
    if ($(element).css("display") === "none") {
        invisibleParent = true;
    } else {
        $(element).parents().each(function (i, el) {
            if ($(el).css("display") === "none") {
                invisibleParent = true;
                return false;
            }
            return true;
        });
    }
    return !invisibleParent;
}

class HighlightedOverlay extends Component {

    constructor(props) {
        super(props);
        this.isSubscribed = false;
        this.state = {
            newPos: null
        };
        this.subscribeToInitialState = this.subscribeToInitialState.bind(this);
        this.setSelectedPosition = this.setSelectedPosition.bind(this);
    }

    componentDidMount() {
        this.setFirstChildMargin();
        this.subscribeToInitialState();
    }

    componentWillUnmount(){
        this.$DOMNode = undefined;
    }

    setFirstChildMargin(){
        const $firstPageContainerChild = $('#pageContainer :first-child');
        this.firstChildMargin = 0;
        if($firstPageContainerChild && $firstPageContainerChild.css('position') !== 'fixed'){
            this.firstChildMargin = parseInt($firstPageContainerChild.css('margin-top'));
        }
    }

    subscribeToInitialState(){
        const { selectedKey, initialState } = this.props;
        if(selectedKey && initialState){
            //this.doShowButtonLine = initialState.selected && initialState.selected.length === 1;
            const element = initialState.elements[selectedKey];
            if(element){
                const targetDOMNode = element.getDOMNode();
                this.setSelectedPosition({targetDOMNode});
            }
        }
    }

    setSelectedPosition(options){
        let targetDOMNode = options.targetDOMNode;
        if(targetDOMNode){
            const $DOMNode = $(targetDOMNode);
            if($DOMNode){
                if(isVisible($DOMNode)){
                    let pos = $DOMNode.offset();
                    let newPos = {
                        top: pos.top - this.firstChildMargin,
                        left: pos.left,
                        width: $DOMNode.outerWidth(),
                        height: $DOMNode.outerHeight()
                    };
                    this.setState({newPos});
                }
            }
        }
    }

    render(){
        const {newPos} = this.state;
        const { selectedKey, initialState: {highlighted} } = this.props;
        let isHighlighted = highlighted && highlighted.length > 0 && highlighted.indexOf(selectedKey) >= 0;
        let content;
        if(newPos){
            const endPoint = {
                top: newPos.top + px,
                left: newPos.left + px,
                width: '1px',
                height: '1px',
                position: position,
                zIndex: 1030
            };
            let highlightedBox;
            if(isHighlighted){
                highlightedBox = {
                    top: nullPx,
                    left: nullPx,
                    width: newPos.width + px,
                    height: newPos.height + px,
                    borderRadius: borderRadius
                }
            }
            content = (
                <div style={endPoint}>
                    {isHighlighted ?
                        <div className="selected-overlay-highlighted" style={highlightedBox}></div> : null
                    }
                </div>
            );
        } else {
            const style = {
                display: 'none'
            };
            content = (<span style={style}></span>);
        }
        return content;
    }

}

export default HighlightedOverlay;
