import _ from 'lodash';

const header = _.template(
`import React, { Component, PropTypes } from 'react';\n`);

const headerImportsMembers = _.template(
`import { <%= members.join(',') %> } from '<%= relativeSource %>';\n`);

const headerImportsDefaults = _.template(
`import <%= name %> from '<%= relativeSource %>';\n`);

const stateProps = _.template(
` const {  \n`);

const classWrapper = _.template(
`class <%= componentName %> extends Component {

    constructor(props, content) {
        // this.state = {count: props.initialCount};
        super(props, content);
    }

    render() {
        // const { propOne, propTwo } = this.props;
        return (
            <<%= model.type %> {...this.props} <%= api.getComponentProps({ props: model.props, api: api }) %> >
                <%= api.getComponentChildren({ model: model, api: api }) %>
            </<%= model.type %>>
        );
    }
}
export default <%= componentName %>;\n`);

export function getComponentClassHeader(){
    return header();
}

export function getComponentClassMemberImports(options) {
    const { imports } = options;
    let result = '';
    let importsMap = {};
    imports.forEach(item => {
        if (item.member && !item.name) {
            importsMap[item.relativeSource] = importsMap[item.relativeSource] || [];
            importsMap[item.relativeSource].push(item.member);
        }
    });
    _.forOwn(importsMap, (members, relativeSource) => {
        result += headerImportsMembers({ members, relativeSource });
    });
    return result;
}

export function getComponentClassDefaultImports(options){
    const { imports } = options;
    let result = '';
    let importsMap = {};
    imports.forEach( item => {
        if(!item.member && item.name){
            importsMap[item.relativeSource] = importsMap[item.relativeSource] || [];
            importsMap[item.relativeSource].push(item.name);
        }
    });
    _.forOwn(importsMap, (name, relativeSource) => {
        result += headerImportsDefaults({ name, relativeSource });
    });
    return result;
}

export function getStateProps(options){

}

export function getComponentClass(options){
    return classWrapper(options);
}