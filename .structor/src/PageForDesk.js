var _ = require('lodash');
var React = require('react');
var PreviewOverlay = require('./PreviewOverlay.js');
var components = require('./index.js');
import { matchPattern, formatPattern, getParams } from 'react-router/lib/PatternUtils.js';
import pageDefaultModel from './model.js';

var instanceMap = {};

var PageForDesk = React.createClass({

    getInitialState: function(){
        return {
            pageModel: pageDefaultModel
        };
    },

    componentDidMount: function(){
        window.Page = this;
        var pathname = this.props.location.pathname;
        //console.log('Page is mounted with location pathname: ' + pathname);
        this._updatePageModel(pathname);
        if(window.onPageDidMount){
            window.onPageDidMount();
        }
    },

    componentWillUnmount: function(){
        window.Page = null;
        if(window.onPageWillUnmount){
            window.onPageWillUnmount();
        }
    },

    componentWillReceiveProps(nextProps){
        if(nextProps.location.pathname !== this.props.location.pathname){
            this._updatePageModel(nextProps.location.pathname);
        }
    },

    componentDidUpdate: function(prevProps, prevState){
        //console.log('Page is updated...');
        if(window.onPageDidUpdate){
            window.onPageDidUpdate();
        }
    },

    componentWillUpdate: function(nextProps, nextState){
        if(window.onPageWillUpdate){
            window.onPageWillUpdate();
        }
    },

    shouldComponentUpdate: function(nextProps, nextState){
        return (this.state.pageModel !== nextProps.pageModel
        || this.state.previewModel !== nextProps.previewModel);
    },

    _updatePageModel: function(pathname){
        var pageModel = null;
        //console.log('Try to update page model by pathname: ' + pathname);
        if(window.__model && window.__model.pages && window.__model.pages.length > 0){
            var pages = window.__model.pages;
            if(pathname === '/'){
                pageModel = pages[0];
            } else {
                pages.forEach( function(page, index){
                    if(pathname === page.pagePath){
                        pageModel = page;
                    }
                });
                if(!pageModel){
                    //check if pathname has valid parameters for route path pattern
                    pages.forEach( function(page, index){
                        try{
                            //var pathObj = matchPattern(page.pagePath, pathname.substr(1));
                            var paramsObj = getParams(page.pagePath, pathname);
                            var formattedPath = formatPattern(page.pagePath, paramsObj);
                            if(pathname === formattedPath){
                                pageModel = page;
                            }
                        } catch(e){
                            console.error(e.message);
                            pageDefaultModel.children[0].children[0].text = e.message;
                        }
                    });
                }
            }
        }
        if(pageModel){
            this.setState({ pageModel: pageModel });
        } else {
            this.setState({ pageModel: pageDefaultModel });
        }
        if(window.__setCurrentPathname && pageModel){
            window.__setCurrentPathname(pageModel.pagePath);
        }
    },

    updateModel: function(model){
        window.__model = model;
        if(this.props.location.pathname){
            this._updatePageModel(this.props.location.pathname);
        }
    },

    updatePreviewModel: function(model){
        this.setState({ previewModel: model });
    },

    handleClosePreview: function(){
        if(window.__closePreview){
            window.__closePreview();
        }
    },

    handleDeletePreview: function(){
        if(window.__deletePreview){
            window.__deletePreview();
        }
    },

    createElements: function(model){

        var elements = [];
        model.children.forEach(function(child, index){
            elements.push(this.createElement(child, index));
        }.bind(this));
        return elements;
    },

    createElement: function(options, ref){

        var type = 'div';
        if(options.type){
            type = this.findComponent(components, options.type, 0);
            if(!type){
                type = options.type;
            } else if(!_.isObject(type)){
                console.error('Element type: ' + options.type + ' is not object. Please check your index.js file');
                type = 'div';
            }
        }

        var props = _.extend({}, { params: this.props.params }, options.props);
        props.key = ref;

        var self = this;
        if(_.isObject(type)){
            _.forOwn(props, function(prop, propName){
                if(prop && _.isObject(prop) && prop.type){
                    props[propName] = self.createElement(prop, 0);
                }
            });
        }

        var nestedElements = null;
        if(options.children && options.children.length > 0){
            var children = [];
            options.children.forEach(function(childOptions){
                children.push(self.createElement(childOptions, ++ref));
            });
            nestedElements = children;
        } else if(options.text) {
            nestedElements = options.text;
        }
        var result = null;
        instanceMap = {};
        try{
            result = React.createElement(type, props, nestedElements);
            if(result.type.prototype){
                if(result.type.prototype.render){
                    result.type.prototype.render = (function(fn){
                        return function render(){
                            try {
                                let temp = fn.apply(this, arguments);
                                instanceMap[this.props['data-umyid']] = temp._owner._rootNodeID;
                                //console.log('Temp: %o, %o', temp._owner._rootNodeID, this.props);
                                return temp;
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
                                    },
                                    'data-umyid': this.props['data-umyid']
                                }, React.createElement('span', {
                                    style: {
                                        display: 'table-cell',
                                        verticalAlign: 'middle'
                                    }
                                }, '\`' + options.type + '\` ' + err.toString()));
                            }
                        }
                    }(result.type.prototype.render));
                }
            }

        } catch(e){
            console.error('Element type: ' + options.type + ' is not valid React Element. Please check your index.js file. ' + e);
        }
        return result;
    },

    findComponent: function(index, componentName, level){
        var result;
        if(index && _.isObject(index) && level <= 1){
            level++;
            _.forOwn(index, function(value, key){
                if(!result){
                    if(key === componentName){
                        result = value;
                    } else if(value && _.isObject(value)){
                        result = this.findComponent(value, componentName, level);
                    }
                }
            }, this);
        }
        return result;
    },

    getInstanceMap: function(){
        var nodeMap = {};
        var nodeList = $("[data-umyid]");
        var visitedIds = [];
        if(nodeList && nodeList.length > 0){
            var umyId = null;
            nodeList.each(function(index, node){
                umyId = node.attributes['data-umyid'].value;
                if(instanceMap[umyId]){
                    nodeMap[umyId] = $('[data-reactid="' + instanceMap[umyId] + '"]')[0];
                    visitedIds.push(umyId);
                } else {
                    nodeMap[umyId] = node;
                }
            });
        }
        var allIds = _.keys(instanceMap);
        var difference = _.difference(allIds, visitedIds);
        if(difference && difference.length > 0){
            difference.forEach(function( id ){
                nodeMap[id] = $('[data-reactid="' + instanceMap[id] + '"]')[0];
            });
        }
        nodeList = null;
        return nodeMap;
    },

    render: function(){
        var content = null;
        if(this.state.previewModel){
            var previewElementTree = this.createElements(this.state.previewModel);
            content = (
                <PreviewOverlay
                    onClose={this.handleClosePreview}
                    onDelete={this.handleDeletePreview}>
                    {previewElementTree}
                </PreviewOverlay>
            );
        } else {
            content = this.createElements(this.state.pageModel);
        }
        return (
            <div>
                {content}
            </div>
        );
    }

});

module.exports = PageForDesk;

