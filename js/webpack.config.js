const path = require('path');

var loaders = [
    { test: /\.json$/, loader: "json-loader" }
];

var externals = ['@jupyter-widgets/base', 'jupyter-datawidgets', 'three'];

module.exports = [
    {
        // Notebook extension
        entry: './src/extension.js',
        output: {
            filename: 'extension.js',
            path: path.resolve('../pythreejs/static'),
            libraryTarget: 'amd'
        },
        resolve: {
            extensions: [ ".autogen.js", ".js" ]
        },
    },
    {
        // jupyter-threejs bundle for the notebook
        entry: './src/index.js',
        output: {
            filename: 'index.js',
            path: path.resolve('../pythreejs/static'),
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        module: {
            rules: loaders
        },
        externals: externals,
        resolve: {
            extensions: [ ".autogen.js", ".js" ]
        },

    },
    {
        // embeddable jupyter-threejs bundle
        entry: './src/embed.js',
        output: {
            filename: 'index.js',
            path: path.resolve('./dist/'),
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        module: {
            rules: loaders
        },
        externals: externals,
        resolve: {
            extensions: [ ".autogen.js", ".js" ]
        },

    },
    {
        // embeddable jupyter-threejs bundle
        entry: './src/index.js',
        output: {
            filename: 'index.standalone.js',
            path: path.resolve('./dist/'),
        },
        devtool: 'source-map',
        module: {
            rules: loaders
        },
        resolve: {
            extensions: [ ".autogen.js", ".js" ]
        },

    }

];
