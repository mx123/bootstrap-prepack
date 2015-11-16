var esprima = require('esprima');

// Executes visitor on the object and its children (recursively).
function traverse(object, visitor) {

    visitor(object);

    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseToResult(object, visitor, result) {

    var _result = visitor(object, result);

    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            var child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverseToResult(child, visitor, _result);
            }
        }
    }
}

var data = 'const { application1: { demo: { next, nextNext }, demo2: { nex2: [{next2ID, next3ID}] } } } = props;';
var dataConverted = 'const s = { application1: { demo: { next: \'test\', nextNext: \'test\' }, demo2: { nex2: [ {next2ID: 1, next3ID: 1}, {next2ID: 2, next3ID: 2} ] } } };';
//data = 'const { variable: variableName, var2, var2 } = props;';

var dataFunc = '(arg1, arg2) => { $action($ref1, $ref2); $action(arg1, arg2); }';

var dataObj = 'const s = { application: { demo: { next: null }, demo: [ {id: 1}, {id: 1} ] }, application2: 12345 } ';

var classObj =
'class Test extends Component { handleOnClick = (e) => { e.preventDefault(); e.stopPropagation(); const { dispatch, list2 } = this.props; dispatch(myAsyncAction( this.refs.testingRef.getValue(), list2)); } }';

try{
    //var ast = esprima.parse(data, {tolerant: true, range: false, comment: false});
    //console.log(JSON.stringify(ast, null, 4));

    //var astConverted = esprima.parse(dataConverted, {tolerant: true, range: false, comment: false});
    //console.log(JSON.stringify(astConverted, null, 4));

    //var resultObj = {};
    //traverseToResult(ast, function(node, res){
    //    console.log('Result: ' + res);
    //    if( node.type === 'Property' && node.key && node.key.type === 'Identifier' && node.value){
    //        console.log('Type of node: ' + node.type);
    //        if(node.value.type === 'ObjectPattern' || node.value.type === 'ArrayPattern'){
    //            res[node.key.name] = {};
    //            return res[node.key.name];
    //        } else if(node.value.type === 'Identifier'){
    //            res[node.value.name] = 'undefined';
    //            return res;
    //        }
    //    }
    //    return res;
    //}, resultObj);
    //
    //console.log(JSON.stringify(resultObj, null, 4));
    //
    //var propsFromState = [];
    //
    //traverse(ast, function(node){
    //    if(node.type === 'Property' && node.value.type === 'Identifier'){
    //        propsFromState.push(node.value.name);
    //    }
    //});
    //
    //console.log(JSON.stringify(propsFromState, null, 4));

    //var ast1 = esprima.parse(dataFunc, {tolerant: true, range: false, comment: false});
    //console.log(JSON.stringify(ast1, null, 4));

    //var ast2 = esprima.parse(dataObj, {tolerant: true, range: false, comment: false});
    //console.log(JSON.stringify(ast2, null, 4));

    var ast3 = esprima.parse(classObj, {tolerant: true, range: false, comment: false});
    console.log(JSON.stringify(ast3, null, 4));


} catch (e){
    console.error(e);
}
