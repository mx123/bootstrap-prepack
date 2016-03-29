import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

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

class SelectedOverlay extends Component {

    constructor(props) {
        super(props);
        this.isSubscribed = false;
        this.state = {
            newPos: null,
            border: '' + (props.bSize ? props.bSize : borderSize) + ' ' + (props.bStyle ? props.bStyle : borderStyle)
        };
        this.startRefreshTimer = this.startRefreshTimer.bind(this);
        this.refreshPosition = this.refreshPosition.bind(this);
        this.subscribeToInitialState = this.subscribeToInitialState.bind(this);
        this.setSelectedPosition = this.setSelectedPosition.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    componentDidMount() {
        this.bodyWidth = document.body.clientWidth;
        this.setFirstChildMargin();
        this.subscribeToInitialState();
    }

    componentWillUnmount(){
        if(this.refreshTimerId){
            clearTimeout((this.refreshTimerId));
            this.refreshTimerId = undefined;
        }
        this.$DOMNode = undefined;
    }

    componentDidUpdate(){
        this.bodyWidth = document.body.clientWidth;
        this.setFirstChildMargin();
        this.subscribeToInitialState();
    }

    componentWillReceiveProps(nextProps){
        this.isSubscribed = false;
    }

    setFirstChildMargin(){
        const $firstPageContainerChild = $('#pageContainer :first-child');
        this.firstChildMargin = 0;
        if($firstPageContainerChild && $firstPageContainerChild.css('position') !== 'fixed'){
            this.firstChildMargin = parseInt($firstPageContainerChild.css('margin-top'));
        }
    }

    subscribeToInitialState(){
        if(!this.isSubscribed){
            const { selectedKey, initialState } = this.props;
            if(selectedKey && initialState){
                //this.doShowButtonLine = initialState.selected && initialState.selected.length === 1;
                console.log('Try to setup a subscription to selected');
                const selected = initialState.elements[selectedKey];
                if(selected){
                    console.log('Set subscription to selected');
                    const targetDOMNode = selected.getDOMNode();
                    this.isSubscribed = true;
                    this.setSelectedPosition({targetDOMNode});
                }
            }
        }
    }

    startRefreshTimer(){
        this.refreshTimerId = setTimeout(() => {
            this.refreshPosition();
        }, 500);
    }

    refreshPosition(){
        const $DOMNode = this.$DOMNode;
        if($DOMNode){
            const { newPos: oldPos } = this.state;
            if(isVisible($DOMNode)){
                let pos = $DOMNode.offset();
                let newPos = {
                    top: pos.top - this.firstChildMargin,
                    left: pos.left,
                    width: $DOMNode.outerWidth(),
                    height: $DOMNode.outerHeight()
                };
                if(!oldPos ||
                    newPos.top !== oldPos.top ||
                    newPos.left !== oldPos.left ||
                    newPos.width !== oldPos.width ||
                    newPos.height !== oldPos.height){
                    this.setState({newPos});
                }
            } else {
                if(oldPos){
                    this.setState({newPos: null});
                }
            }
        }
        this.startRefreshTimer();
    }

    resetTimer(){
        if(this.refreshTimerId){
            clearTimeout((this.refreshTimerId));
            this.refreshTimerId = undefined;
        }
        this.$DOMNode = undefined;
    }

    setSelectedPosition(options){
        console.log('Set selected position: ' + options.targetDOMNode);
        let targetDOMNode = options.targetDOMNode;
        if(targetDOMNode){
            this.resetTimer();
            this.$DOMNode = $(targetDOMNode);
            this.refreshPosition();
        }
    }

    handleButtonClick(selectedKey, func, e){
        e.preventDefault();
        e.stopPropagation();
        if(func){
            func(selectedKey, e.metaKey || e.ctrlKey)
        }
    }

    render(){
        const {newPos, border} = this.state;
        const { selectedKey, initialState: {selected, onSelectParent} } = this.props;
        let isMultipleSelection = selected && selected.length > 1;
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
            const topLine = {
                top: nullPx,
                left: nullPx,
                width: (newPos.width - 1) + 'px',
                height: nullPx,
                position: position,
                borderTopLeftRadius: borderRadius,
                borderTopRightRadius: borderRadius,
                borderTop: border
            };
            const leftLine = {
                top: nullPx,
                left: nullPx,
                width: nullPx,
                height: (newPos.height - 1) + px,
                position: position,
                borderTopLeftRadius: borderRadius,
                borderBottomLeftRadius: borderRadius,
                borderLeft: border
            };
            const bottomLine = {
                bottom: '-' + (newPos.height - 1) + px,
                left: nullPx,
                width: newPos.width + px,
                height: nullPx,
                position: position,
                borderBottomLeftRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
                borderBottom: border
            };
            const rightLine = {
                right: '-' + (newPos.width - 1) + px,
                top: nullPx,
                width: nullPx,
                height: newPos.height + px,
                position: position,
                borderTopRightRadius: borderRadius,
                borderBottomRightRadius: borderRadius,
                borderRight: border
            };
            let buttonLine;
            if(!isMultipleSelection){
                buttonLine = {
                    display: 'flex',
                    flexDirection: 'row',
                    position: position
                };
                if ((newPos.left + 400) < this.bodyWidth) {
                    buttonLine.left = nullPx;
                } else {
                    buttonLine.right = '-' + (newPos.width - 1) + px;
                }
                if (newPos.top < 50) {
                    buttonLine.bottom = 'calc(-' + (newPos.height - 1) + px + ' - 1em)';
                } else {
                    buttonLine.top = '-1em';
                }
            }
            const firstButtonClassName = 'selected-overlay-button selected-overlay-button-select-parent';
            content = (
                <div style={endPoint}>
                    <div style={topLine}></div>
                    <div style={leftLine}></div>
                    <div style={bottomLine}></div>
                    <div style={rightLine}></div>
                    <div style={buttonLine}>
                        {isMultipleSelection ?
                            null
                            :
                            <div className={firstButtonClassName}
                                 onClick={(e) => this.handleButtonClick(selectedKey, onSelectParent, e)}></div>
                        }
                    </div>
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

export default SelectedOverlay;
