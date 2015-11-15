
function traverseModel(node, visitor, result){
    let _result = visitor(node, result);
    if(node.children && node.children.length > 0){
        node.children.forEach( child => {
            traverseModel(child, visitor, _result);
        });
    }
}

export function getMetaModel(model){
    let result = [];
    traverseModel(model, (node, tree) => {
        let metaNode = {
            type: node.type,
            props: node.props,
            children: []
        };
        tree.push(metaNode);
        return metaNode.children;
    }, result);
    return result;
}
