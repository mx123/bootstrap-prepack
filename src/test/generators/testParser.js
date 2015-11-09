var esprima = require('esprima');

const data =
'const { application,  application: { subApp1: { variable: variableName } } } = props;';

const dataFunc =
'(arg1, arg2) => { action(ref1, ref2); action(arg1, arg2); }';

try{
    const ast = esprima.parse(dataFunc, {tolerant: true, range: false, comment: false});

    console.log(JSON.stringify(ast, null, 4));
} catch (e){
    console.error(e);
}
