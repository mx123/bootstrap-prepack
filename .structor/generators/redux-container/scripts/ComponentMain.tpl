<%
    function processChild(model){
        var result = '<' + model.type + ' ' + processProps(model.props) + '>';
        if(model.children && model.children.length > 0) {
            _.forEach(model.children, function(child) {
                result += processChild(child);
            });
        } else if(model.text && model.text.length > 0){
            result += model.text;
        }
        result += '</' + model.type + '>';
        return result;
    }

    function processStyle(styleObject){
        var result = '';
        if(styleObject && !_.isEmpty(styleObject)){
            _.forOwn(styleObject, function(value, prop){
                if(_.isString(value) && value.length > 0){
                    result += ' ' + prop + ": '" + value + "',";
                } else if(_.isBoolean(value) || _.isNumber(value)){
                    result += ' ' + prop + ": " + value + ",";
                }
            });
            result = result.substr(0, result.length - 1);
        }
        return result;
    }

    function processProps(props){

        var result = '';
        if(props && !_.isEmpty(props)){
            _.forOwn(props, function(value, prop){
                if(_.isString(value) && value.length > 0){
                    result += prop + "=\"" + value + "\"";
                } else if(_.isBoolean(value) || _.isNumber(value)){
                    result += prop + "={" + value + "} ";
                } else if(_.isArray(value)){
                    var arrayString = '';
                    _.forEach(value, function(item){
                        if(_.isObject(item)){
                            arrayString += '{ ' + processStyle(item) + ' },';
                        } else {
                            if(_.isString(item) && item.length > 0){
                                arrayString += "\'" + item + "\',";
                            } else if(_.isBoolean(item) || _.isNumber(item)){
                                arrayString += item + ',';
                            }
                        }
                    });
                    result += prop + '={[ ' + arrayString.substr(0, arrayString.length - 1) + ']}';
                } else if(_.isObject(value)){
                    if(value['type']){
                        result += prop +"={ " + processChild(value) + " }";
                    } else {
                        result += prop + "={{ " + processStyle(value) + " }} ";
                    }
                }
            });
        }
        return result;
    }

    function processElementProps(props){

        var result = '';
        if(props && !_.isEmpty(props)){
            _.forOwn(props, function(value, prop){
                if(_.isObject(value)){
                    if(value['type']){
                        result += prop +"={ " + processChild(value) + " }";
                    }
                }
            });
        }
        return result;
    }

    function processDefaultProps(props) {
        var result = '';
        if (props && !_.isEmpty(props)) {
            _.forOwn(props, function (value, prop) {
                if (_.isString(value) && value.length > 0) {
                    result += prop + ": '" + value + "', ";
                } else if (_.isBoolean(value) || _.isNumber(value)) {
                    result += prop + ": " + value + ", ";
                } else if(_.isArray(value)){
                    var arrayString = '';
                    _.forEach(value, function(item){
                        if(_.isObject(item)){
                            arrayString += '{ ' + processStyle(item) + ' },';
                        } else {
                            if(_.isString(item) && item.length > 0){
                                arrayString += "\'" + item + "\',";
                            } else if(_.isBoolean(item) || _.isNumber(item)){
                                arrayString += item + ',';
                            }
                        }
                    });
                    result += prop + ': [ ' + arrayString.substr(0, arrayString.length - 1) + '], ';
                } else if (_.isObject(value)) {
                    result += prop + ": { " + processStyle(value) + " }, ";
                }
            });
            result = result.length > 2 ? result.substr(0, result.length - 2) : result;
        }
        return result;
    }

    function processPropTypes(props) {
        var result = '';
        if (props && !_.isEmpty(props)) {
            _.forOwn(props, function (value, prop) {
                if (_.isString(value)) {
                    result += prop + ": PropTypes.string, ";
                } else if (_.isArray(value)) {
                    result += prop + ": PropTypes.array, ";
                } else if (_.isNumber(value)) {
                    result += prop + ": PropTypes.number, ";
                } else if (_.isBoolean(value)) {
                    result += prop + ": PropTypes.bool, ";
                } else if (_.isObject(value) && !value['type']) {
                    result += prop + ": PropTypes.object, ";
                }
            });
            result = result.length > 2 ? result.substr(0, result.length - 2) : result;
        }
        return result;
    }
%>
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
<% _.forEach(component.imports, function(item, index) { %><%= '\n' %><% if(item.member){ %>import { <%= item.member %> } from '<%= item.relativeSource %>';<% } else {%>import <%= item.name %> from '<%= item.relativeSource %>';<% } %><% }); %>

class <%= component.componentName %> extends Component {

    constructor(props, content) {
        super(props, content);  // this.state = {count: props.initialCount};
    }

    render() {
        // const { propOne, propTwo } = this.props;
        return (
            <<%= component.model.type %> {...this.props} <%= processElementProps(component.model.props) %> >
<%         if(component.model.children && component.model.children.length > 0) {
                _.forEach(component.model.children, function(child) { %>
                    <%= processChild(child) %>
<%              });
           } else { %>
                {this.props.children}
<%         } %>
<%         if(component.model.text && component.model.text.length > 0){%>
                <%= component.model.text %>
<%         } %>
           </<%= component.model.type %>>
        );
    }
}
<%= '\n' %><% if (component.model.props && !_.isEmpty(component.model.props)) { %>
<%= component.componentName %>.propTypes = {
<%= processPropTypes(component.model.props) %>
};
<%= component.componentName %>.defaultProps = {
<%= processDefaultProps(component.model.props) %>
};<%= '\n' %><% } %>

function mapStateToProps(state) {
    // const { data } = state;
    return {};
}
function mapDispatchToProps(dispatch) {
    return {
        //onAction: () => dispatch(action())
    };
}

export default connect( mapStateToProps, mapDispatchToProps )(<%= component.componentName %>);


