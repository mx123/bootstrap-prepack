var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        name: "browser",
        entry: {
            main: './src/client/main.js'
        },
        output: {
            path: './public/resources',
            filename: 'bundle.js'
        },
        devtool: 'inline-source-map',
        debug: true,
        module: {
            loaders: [
                { test: /\.(js|jsx)$/, loader: 'babel', query: { stage: 0 } },
                { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
                { test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)([\?]?.*)$/, loader: 'url-loader' }
            ]
        },
        plugins: [
            new ExtractTextPlugin("styles.css")
        ],
        externals: {
            "jquery": "jQuery"
        }
    }
];

