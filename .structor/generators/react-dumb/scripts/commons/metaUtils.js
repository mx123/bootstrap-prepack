import esprima from 'esprima';

// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {

    visitor(object);

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function parseStateToProps(meta){
    var propVars = [];
    const { component: { stateToProps } } = meta;
    if(!stateToProps || stateToProps.length <= 0){
        throw Error('Meta info parsing: component.stateToProps is not specified')
    }
    try{
        const ast = esprima.parse('const ' + stateToProps + '=meta;', {tolerant: true, range: false, comment: false});
        traverse(ast, function(node){
            if(node.type === 'Property' && node.value.type === 'Identifier'){
                propVars.push(node.value.name);
            }
        });
    } catch(e){
        throw Error('Meta info component.stateToProps parsing: ' + (e.message || e));
    }
    return propVars;
}

export function parseMeta(meta) {

    let result = {};

    const { component: { reducerRoot, stateToProps, handlers } } = meta;

    result.propVars = parseStateToProps(meta);


    console.log('//---- --------------- ----//');
    console.log('//---- meta dataObject ----//');
    console.log('//---- --------------- ----//');
    console.log(JSON.stringify(result, null, 4));

    return result;

}


