import { forOwn, isObject, isString, extend, difference, keys } from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
//import PreviewOverlay from './PreviewOverlay.js';
import MouseOverOverlay from './MouseOverOverlay.js';
import SelectedOverlay from './SelectedOverlay.js';
import HighlightedOverlay from './HighlightedOverlay.js';
import ClipboardOverlay from './ClipboardOverlay.js';
import components from './index.js';
import { matchPattern, formatPattern, getParams } from 'react-router/lib/PatternUtils.js';
import pageDefaultModel from './model.js';

function wrapComponent(WrappedComponent, props) {
    const { onMouseDown, initialState, key, type } = props;
    const myName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    var klass = React.createClass({
        subscribeToInitialState(){
            if(initialState){
                initialState.elements[key] = {
                    getDOMNode: () => {
                        return this.DOMNode;
                    }
                }
            }
        },
        componentWillMount(){
            this.subscribeToInitialState();
        },
        componentDidMount(){
            this.DOMNode = ReactDOM.findDOMNode(this);
            this.$DOMNode = $(this.DOMNode);
            this.$DOMNode
                .on('mousedown', this.handleMouseDown)
                .on('mouseover', this.handleMouseOver)
                .on('mouseout', this.handleMouseOut)
                .on('click', this.handleNoop)
                .on('doubleclick', this.handleNoop)
                .on('mouseup', this.handleNoop);
        },
        componentWillUnmount(){
            if(this.$DOMNode){
                this.$DOMNode
                    .off('mousedown')
                    .off('mouseover')
                    .off('mouseout')
                    .off('click')
                    .off('doubleclick')
                    .off('mouseup');
            }
            this.$DOMNode = undefined;
            this.DOMNode = undefined;
        },
        componentWillReceiveProps(nextProps){
            this.subscribeToInitialState();
        },
        handleMouseDown(e){
            if(!e.shiftKey){
                e.stopPropagation();
                e.preventDefault();
                if(onMouseDown){
                    onMouseDown(key, e.metaKey || e.ctrlKey);
                }
            }
        },
        handleMouseOver(e){
            if(initialState && initialState.onMouseOver){
                initialState.onMouseOver({ targetDOMNode: this.DOMNode, type});
            }
        },
        handleMouseOut(e){
            if(initialState && initialState.onMouseOut){
                initialState.onMouseOut({ targetDOMNode: this.DOMNode, remove: true});
            }
        },
        handleNoop(e){
            if(!e.shiftKey) {
                e.stopPropagation();
                e.preventDefault();
            }
        },
        render: function(){
            return <WrappedComponent {...this.props} />;
        }
    });
    klass.displayName = myName;
    return klass;
}

class PageForDesk extends Component {

    constructor(props, content) {
        super(props, content);
        this.state = {
            pageModel: pageDefaultModel,
            isEditModeOn: true
        };
        this.elementTree = [];
        this.initialState = {elements: {}, selected: [], highlighted: [], forCutting: []};
        this.updatePageModel = this.updatePageModel.bind(this);
        this.setGraphApi = this.setGraphApi.bind(this);
        this.setOnComponentMouseDown = this.setOnComponentMouseDown.bind(this);
        this.getModelByPathname = this.getModelByPathname.bind(this);
        this.visitGraphNode = this.visitGraphNode.bind(this);
        this.updateInitialState = this.updateInitialState.bind(this);
        this.traverseModel = this.traverseModel.bind(this);
        this.createElements = this.createElements.bind(this);
        this.createElement = this.createElement.bind(this);
        this.findComponent = this.findComponent.bind(this);
    }

    setGraphApi(graph){
        this.graph = graph;
    }

    setOnComponentMouseDown(func){
        this.onComponentMouseDown = func;
    }

    setOnPathnameChanged(func){
        this.onPathnameChanged = func;
    }

    bindToState(signature, func){
        this.initialState[signature] = func;
    }

    componentDidMount(){
        var pathname = this.props.location.pathname;
        if(window.onPageDidMount){
            window.onPageDidMount(this, pathname);
        }
        //this.updatePageModel({pathname});
    }

    componentWillUnmount(){
        this.initialState = undefined;
        this.elementTree = undefined;
    }

    componentWillReceiveProps(nextProps){
        //console.log('it happens when a user changes route through the live preview');
        if(nextProps.location.pathname !== this.props.location.pathname){
            this.updatePageModel({pathname: nextProps.location.pathname});
            if(this.onPathnameChanged){
                this.onPathnameChanged(nextProps.location.pathname);
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return (this.state.pageModel !== nextProps.pageModel);
    }

    getModelByPathname(pathname){
        const graph = this.graph;
        let pageModel = pageDefaultModel;
        if(graph){
            const model = graph.getModel();
            if(model && model.pages && model.pages.length > 0){
                let graphRootKey = pathname === '/' ? model.pages[0].pagePath : pathname;
                if(graph.getGraph().hasNode(graphRootKey)){
                    console.log('Traversing graph key: ' + graphRootKey);
                    pageModel = graph.traverseGraph(graphRootKey);
                } else {
                    //check if pathname has valid parameters for route path pattern
                    try{
                        model.pages.forEach((page, index) => {
                            let paramsObj = getParams(page.pagePath, pathname);
                            let formattedPath = formatPattern(page.pagePath, paramsObj);
                            if (pathname === formattedPath) {
                                graphRootKey = formattedPath;
                            }
                        });
                        if(graph.getGraph().hasNode(graphRootKey)){
                            console.log('Traversing graph key: ' + graphRootKey);
                            pageModel = graph.traverseGraph(graphRootKey);
                        } else {
                            pageModel.children[0].children[0].modelNode.text =
                                'Route was not found: ' + pathname + '. Try to select another route.';
                        }
                    } catch(e){
                        console.error('Path name ' + pathname + ' in project model was not found. ' + String(e));
                        pageModel.children[0].children[0].modelNode.text = String(e);
                    }
                }
            }
        }
        return pageModel;
    }

    updatePageModel(options){

        let {pathname, isEditModeOn} = options;
        let pageModel = this.getModelByPathname(pathname);
        isEditModeOn = isEditModeOn !== undefined ? isEditModeOn : this.state.isEditModeOn;

        this.initialState.elements = {};
        this.initialState.selected = [];
        this.initialState.highlighted = [];
        this.initialState.forCutting = [];
        if(isEditModeOn === true){
            this.traverseModel(pageModel, this.initialState, {isEditModeOn: true});
        }
        this.elementTree = this.createElements(pageModel, this.initialState, {isEditModeOn});

        console.log('Page should be updated');
        this.setState({
            pageModel: pageModel,
            isEditModeOn: isEditModeOn
        });
    }

    updateInitialState(){
        let pageModel = this.getModelByPathname(this.props.location.pathname);
        this.initialState.selected = [];
        this.initialState.highlighted = [];
        this.initialState.forCutting = [];
        this.traverseModel(pageModel, this.initialState, {isEditModeOn: true});
        console.log('Initial state should be updated');
        this.setState({
            pageModel: pageModel
        });
    }

    traverseModel(model, initialState, options){
        if(model.children && model.children.length > 0){
            model.children.forEach((child, index) => {
                this.visitGraphNode(child, initialState, options);
            });
        }
    }

    visitGraphNode(graphNode, initialState, options){

        if(options.isEditModeOn){
            if(graphNode.selected){
                initialState.selected.push(graphNode.key);
            }
            if(graphNode.highlighted){
                initialState.highlighted.push(graphNode.key);
            }
            if(graphNode.isForCutting){
                initialState.forCutting.push(graphNode.key);
            }
        }

        if(graphNode.props){
            forOwn(graphNode.props, (prop, propName) => {
                this.visitGraphNode(prop, initialState, options);
            });
        }
        if(graphNode.children && graphNode.children.length > 0){
            graphNode.children.forEach(node => {
                this.visitGraphNode(node, initialState, options);
            });
        }

    }

    findComponent(index, componentName, level){
        let result = null;
        if(index && isObject(index) && level <= 1){
            level++;
            forOwn(index, (value, key) => {
                if(!result){
                    if(key === componentName){
                        result = value;
                    } else if(value && isObject(value)){
                        result = this.findComponent(value, componentName, level);
                    }
                }
            });
        }
        return result;
    }

    createElement(graphNode, initialState, options){

        let type = 'div';
        let modelNode = graphNode.modelNode;
        if(modelNode.type){
            type = this.findComponent(components, modelNode.type, 0);
            if(!type){
                type = modelNode.type;
            } else if(!isObject(type)){
                console.error('Element type: ' + modelNode.type + ' is not object. Please check your index.js file');
                type = 'div';
            }
        }

        let props = extend({}, {
            key: graphNode.key,
            params: this.props.params,
            location: this.props.location
        }, modelNode.props);

        if(graphNode.props){
            forOwn(graphNode.props, (prop, propName) => {
                props[propName] = this.createElement(prop, initialState, options);
            });
        }

        let nestedElements = null;

        if(graphNode.children && graphNode.children.length > 0){
            let children = [];
            graphNode.children.forEach(node => {
                children.push(this.createElement(node, initialState, options));
            });
            nestedElements = children;
        } else if(modelNode.text) {
            nestedElements = [modelNode.text];
        }

        let result = null;
        try{
            if(options.isEditModeOn){
                const wrapperProps = {
                    onMouseDown: this.onComponentMouseDown,
                    key: graphNode.key,
                    type: modelNode.type,
                    initialState: initialState
                };
                result = React.createElement(wrapComponent(type, wrapperProps), props, nestedElements);
            } else {
                result = React.createElement(type, props, nestedElements);
            }
            if(result.type.prototype){
                if(result.type.prototype.render){
                    result.type.prototype.render = ((fn) => {
                        return function render(){
                            try {
                                return fn.apply(this, arguments);
                            } catch (err) {
                                console.error(err);
                                return React.createElement('div', {
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: '#c62828',
                                        color: 'white',
                                        padding: '3px',
                                        display: 'table'
                                    }
                                }, React.createElement('span', {
                                    style: {
                                        display: 'table-cell',
                                        verticalAlign: 'middle'
                                    }
                                }, '\'' + modelNode.type + '\' ' + err.toString()));
                            }
                        }
                    })(result.type.prototype.render);
                }
            }

        } catch(e){
            console.error('Element type: ' + modelNode.type + ' is not valid React Element. Please check your index.js file. ' + e);
        }
        return result;
    }

    createElements(model, initialState, options){
        let elements = [];
        model.children.forEach(child => {
            elements.push(this.createElement(child, initialState, options));
        });
        console.log('Elements are created');
        return elements;
    }

    render(){
        let content = null;
        //if(this.state.previewModel){
        //    let previewElementTree = this.createElements(this.state.previewModel);
        //    content = (
        //        <PreviewOverlay
        //            onClose={this.handleClosePreview}
        //            onDelete={this.handleDeletePreview}>
        //            {previewElementTree}
        //        </PreviewOverlay>
        //    );
        //} else {
        let elementTree = this.elementTree;
        let boundaryOverlays = [];
        if(this.initialState.selected && this.initialState.selected.length > 0){
            this.initialState.selected.forEach(key => {
                boundaryOverlays.push(
                    <SelectedOverlay key={'selected' + key}
                                     initialState={this.initialState}
                                     selectedKey={key} />
                );
            });
        }
        if(this.initialState.forCutting && this.initialState.forCutting.length > 0){
            this.initialState.forCutting.forEach(key => {
                boundaryOverlays.push(
                    <ClipboardOverlay key={'forCutting' + key}
                                     initialState={this.initialState}
                                     bSize="2px"
                                      bStyle="dashed #f0ad4e"
                                     selectedKey={key} />
                );
            });
        }
        if(this.initialState.highlighted && this.initialState.highlighted.length > 0){
            this.initialState.highlighted.forEach(key => {
                boundaryOverlays.push(
                    <HighlightedOverlay key={'highlighted' + key}
                                     initialState={this.initialState}
                                     selectedKey={key} />
                );
            });
        }
        content = (
            <div id="pageContainer">
                {elementTree}
                {boundaryOverlays}
                <MouseOverOverlay ref="mouseOverBoundary"
                                  initialState={this.initialState}
                                  bSize="1px"/>
            </div>
        );
        //}
        return (
            <div>
                {content}
            </div>
        );
    }

}

export default PageForDesk;

