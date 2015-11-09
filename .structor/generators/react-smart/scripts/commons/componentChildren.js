import _ from 'lodash';

const childComponentEmpty = _.template(
`<<%= model.type %><%= api.getComponentProps({ props: model.props, api: api }) %> />\n`);

const childComponentText = _.template(
`<<%= model.type %><%= api.getComponentProps({ props: model.props, api: api }) %>>
    <%= model.text %>
</<%= model.type %>>\n`);

const childComponent = _.template(
`<<%= model.type %><%= api.getComponentProps({ props: model.props, api: api }) %>>
    <%= api.getComponentChildren({ model: model, api: api }) %>
</<%= model.type %>>\n`);

export function getChildComponent(options){
    const { model } = options;
    if(model.text){
        return childComponentText(options);
    } else if(model.children && model.children.length > 0){
        return childComponent(options);
    } else {
        return childComponentEmpty(options);
    }
}

export function getComponentChildren(options){
    let result = '';
    const { model, api } = options;
    if(model.children && model.children.length > 0){
        model.children.forEach( child => {
            result += api.getChildComponent({ model: child, api });
        });
    }
    return result;
}
