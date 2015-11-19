
var GeneratorManager = require ('structor/server/GeneratorManager.js');
var FileManager = require('structor/server/FileManager.js');
var StateManager = require('structor/server/StateManager.js');
var IndexManager = require('structor/server/IndexManager.js');

var projectDirPath = "/Volumes/Development/projects/umyproto/structor-github-boilerplates/bootstrap-prepack";

var stateManager = new StateManager();
stateManager.setProjectDir(projectDirPath);

var indexManager = new IndexManager(stateManager);
var generatorManager = new GeneratorManager(stateManager, indexManager);
var fileManager = new FileManager();

fileManager.readJson('./model/PanelModel.json')
    .then( function(jsonObj) {
        return generatorManager.doPreGeneration(jsonObj, '02-react-dumb', { componentName: 'Test', groupName: 'GroupTest'})
            .then( function(preGeneratedData) {
                console.log('//--- RAW META ---//');
                console.log(preGeneratedData.metaModel);
                //console.log('//--- RAW README ---//');
                //console.log(preGeneratedData.metaHelp);
                return preGeneratedData;
            });
    })
    .then( function(pregeneratedData){
        var checkedMeta = pregeneratedData.metaModel;

        //checkedMeta.component.stateToProps = "{ application: { githubData: { fetching: { status, errorText, error }, list: [ { id: lid1 }], list2 } } }";
        //checkedMeta.component.stateToProps = "{ testData: { result }, appp: { xresult, arr: [{id, mid}] } }";
        //checkedMeta.component.handlers.componentDidMount = '() => { if(this.props.f = 12){ console.log("12"); } }';
        //checkedMeta.component.handlers.handleOnClick = '() => action_async() ';
        //checkedMeta.component.reducerRoot = 'testPanel2';
        //checkedMeta.component.handlers.handleOnClick = '(e) => { async:myAsyncAction($testingRef.getValue(), $list2); }';
        checkedMeta.component.handlers.handleOnClick1 = '(a1, a2) => { $onSelect(); $setState(); } ';
        //checkedMeta.component.handlers.handleOnClick1 = '(a1, a2) => { $onSelect($testingRef.getValue(), a1, $testingRef2.value); }';
        //checkedMeta.component.handlers.handleOnClick2 = '(a3) => myNewAction2($error);';

        checkedMeta.render.var = 'testingVariable';
        checkedMeta.render.children[0].children[0].var = 'listItemVar_map$list2';
        checkedMeta.render.children[0].children[1].var = 'listItemVar2_if$item2';
        checkedMeta.render.children[0].children[1].children[0].text = '$listItemTex2_if';
        checkedMeta.render.children[0].children[2].var = 'listItemVar3';
        checkedMeta.render.children[0].children[0].props.ref = 'testingRef';
        checkedMeta.render.children[0].children[0].props.onClick = '$handleOnClick1';
        checkedMeta.render.children[0].children[1].props.ref = 'testingRef2';
        checkedMeta.render.children[0].children[1].props.testObj = '$testObjVar.item3';
        checkedMeta.render.children[0].children[1].props.style = '$listStyle';
        checkedMeta.render.children[0].children[0].children[0].text = '$testObjVar.printText';
        checkedMeta.render.children[0].children[3].props.arrayProp = '$myArray';

        console.log('//--- CHECKED META ---//');
        console.log(JSON.stringify(checkedMeta, null, 4));
        return checkedMeta;
    })
    .then( function(meta){
        return fileManager.readJson('./model/PanelModel.json')
            .then( function(jsonObj) {
                return generatorManager.doGeneration(jsonObj, '02-react-dumb', { componentName: 'Test', groupName: 'GroupTest'}, meta)
                    .then( function(generatedObj) {
                        //console.log(JSON.stringify(generatedObj, null, 4));
                        console.log('// ---- Component ----------------------------------------------------------------');
                        console.log(generatedObj.component.sourceCode);
                        //return generatedObj;
                    });
            })
    })
    .catch( function(err) {
        console.error(err);
    });
