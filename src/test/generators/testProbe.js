
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
        return generatorManager.doPreGeneration(jsonObj, '06-react-smart', { componentName: 'Test', groupName: 'GroupTest'})
            .then( function(preGeneratedData) {
                //console.log('//--- RAW META ---//');
                //console.log(preGeneratedData.metaJSON);
                //console.log('//--- RAW README ---//');
                //console.log(preGeneratedData.readMe);
                return preGeneratedData;
            });
    })
    .then( function(pregeneratedData){
        var checkedMeta = JSON.parse(pregeneratedData.metaJSON);
        checkedMeta.checked = true;
        console.log('//--- CHECKED META ---//');
        console.log(JSON.stringify(checkedMeta, null, 4));
        return checkedMeta;
    })
    .then( function(meta){
        return fileManager.readJson('./model/PanelModel.json')
            .then( function(jsonObj) {
                return generatorManager.doGeneration(jsonObj, '06-react-smart', { componentName: 'Test', groupName: 'GroupTest'}, meta)
                    .then( function(generatedObj) {
                        //console.log(JSON.stringify(generatedObj, null, 4));
                        console.log(generatedObj.component.sourceCode);
                        //return generatedObj;
                    });
            })
    })
    .catch( function(err) {
        console.error(err);
    });

//fileManager.readJson('./model/PanelModel.json')
//    .then( function(jsonObj) {
//        return generatorManager.doGeneration(jsonObj, '06-react-smart', { componentName: 'Test', groupName: 'GroupTest'})
//            .then( function(generatedObj) {
//                //console.log(JSON.stringify(generatedObj, null, 4));
//                console.log(generatedObj.component.sourceCode);
//                //return generatedObj;
//            });
//    })
//    //.then( generatedObj => {
//    //    return generatorManager.commitGeneration(generatedObj);
//    //})
//    .catch( function(err) {
//        console.error(err);
//    });
