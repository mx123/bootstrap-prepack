var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var esformatter = require('esformatter');

var esformatterOptions = {
    // inherit from the default preset
    preset : 'default',
    indent : {
        value : '    '
    },
    lineBreak : {
        before : {
            // at least one line break before BlockStatement
            BlockStatement : '>=1',
            // only one line break before BlockStatement
            DoWhileStatementOpeningBrace : 1
            // ...
        }
    },
    "plugins": [
        "esformatter-jsx"
    ],
    // this is the section this plugin will use to store the settings for the jsx formatting
    "jsx": {
        // by default is true if set to false it works the same as esformatter-jsx-ignore
        "formatJSX": true,
        // keep the node attributes on the same line as the open tag. Default is true.
        // Setting this to false will put each one of the attributes on a single line
        "attrsOnSameLineAsTag": false,
        // how many attributes should the node have before having to put each
        // attribute in a new line. Default 1
        "maxAttrsOnTag": 1,
        // if the attributes are going to be put each one on its own line, then keep the first
        // on the same line as the open tag
        "firstAttributeOnSameLine": false,
        // align the attributes with the first attribute (if the first attribute was kept on the same line as on the open tag)
        "alignWithFirstAttribute": true,
        "spaceInJSXExpressionContainers": " ",
        "htmlOptions": { // same as the ones passed to jsbeautifier.html
            "brace_style": "collapse",
            "indent_char": " ",
            //indentScripts: "keep",
            "indent_size": 4,
            "max_preserve_newlines": 2,
            "preserve_newlines": true
            //unformatted: ["a", "sub", "sup", "b", "i", "u" ],
            //wrapLineLength: 0
        }
    }
};

module.exports = {
    formatJs: function(jsData){
        try{

            return esformatter.format(jsData, esformatterOptions);
        } catch(e){
            console.error(e);
            throw Error(e.message);
        }
    },
    readFile: function(filePath){
        return new Promise( function(resolve, reject) {
            fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
                if(err){
                    reject("Can't read file: " + filePath + ". Cause: " + err.message);
                } else {
                    resolve(data);
                }
            });
        });
    }
};

