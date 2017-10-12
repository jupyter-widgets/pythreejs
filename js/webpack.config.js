const path = require('path');

var externals = ['@jupyter-widgets/base', 'three'];

module.exports = [
    {
        // Notebook extension
        entry: './src/extension.js',
        output: {
            filename: 'extension.js',
            path: path.resolve(__dirname, '..', 'pythreejs', 'static'),
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
            path: path.resolve(__dirname, '..', 'pythreejs', 'static'),
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
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
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
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
            path: path.resolve(__dirname, 'dist'),
        },
        devtool: 'source-map',
        resolve: {
            extensions: [ ".autogen.js", ".js" ]
        },

    }

];
