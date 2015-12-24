
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
var generatorName = '04-social-auth-card';

fileManager.readJson('./model/PanelModel.json')
    .then( function(jsonObj) {
        return generatorManager.doPreGeneration(jsonObj, generatorName, { componentName: 'Test', groupName: 'GroupTest'})
            .then( function(preGeneratedData) {
                //console.log('//--- RAW META ---//');
                //console.log(preGeneratedData.metaModel);
                //console.log('//--- RAW README ---//');
                //console.log(preGeneratedData.metaHelp);
                return preGeneratedData;
            });
    })
    .then( function(pregeneratedData){
        var checkedMeta = pregeneratedData.metaModel;
        console.log('//--- CHECKED META ---//');
        console.log(JSON.stringify(checkedMeta, null, 4));
        return checkedMeta;
    })
    .then( function(meta){
        return fileManager.readJson('./model/PanelModel.json')
            .then( function(jsonObj) {
                return generatorManager.doGeneration(jsonObj, generatorName, { componentName: 'Test', groupName: 'GroupTest'}, meta)
                    .then( function(generatedObj) {
                        //console.log(JSON.stringify(generatedObj, null, 4));
                        console.log('// ---- Component ----------------------------------------------------------------');
                        console.log(generatedObj.component.sourceCode);
                        console.log('// ---- Initial state ----------------------------------------------------------------');
                        console.log(generatedObj.modules.initialState.sourceCode);
                        //return generatedObj;
                    });
            })
    })
    .catch( function(err) {
        console.error(err);
    });

