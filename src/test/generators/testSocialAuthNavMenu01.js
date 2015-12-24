
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
var generatorName = 'social-auth-nav-menu-01';
var modelFilePath = './model/NavItemModel.json';

fileManager.readJson(modelFilePath)
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

        checkedMeta.facebookClientId = '921493574594593';
        checkedMeta.googlePlusClientId = '87635633040-iqd8umv5vjs9km254tmnpq9i2l14v3li.apps.googleusercontent.com';
        console.log('//--- CHECKED META ---//');
        console.log(JSON.stringify(checkedMeta, null, 4));
        return checkedMeta;
    })
    .then( function(meta){
        return fileManager.readJson(modelFilePath)
            .then( function(jsonObj) {
                return generatorManager.doGeneration(jsonObj, generatorName, { componentName: 'Test', groupName: 'GroupTest'}, meta)
                    .then( function(generatedObj) {
                        //console.log(JSON.stringify(generatedObj, null, 4));
                        console.log('// ---- Component ----------------------------------------------------------------');
                        console.log(generatedObj.component.sourceCode);
                        console.log('// ---- Initial state ----------------------------------------------------------------');
                        console.log(generatedObj.modules.initialState.sourceCode);
                        console.log('// ---- Actions index ----------------------------------------------------------------');
                        console.log(generatedObj.modules.actionsIndex.sourceCode);
                        console.log('// ---- Reducers ----------------------------------------------------------------');
                        console.log(generatedObj.modules.reducersIndex.sourceCode);
                        console.log('// ---- Actions ----------------------------------------------------------------');
                        console.log(generatedObj.modules.actions.sourceCode);
                        //return generatedObj;
                    });
            })
    })
    .catch( function(err) {
        console.error(err);
    });

