const path = require('path');

const externals = ['@jupyter-widgets/base', 'three', 'module'];

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
            extensions: [ '.autogen.js', '.js' ]
        },
    },
    {
        // jupyter-threejs bundle for the notebook
        entry: ['./amd-public-path.js', './src/index.js'],
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, '..', 'pythreejs', 'static'),
            libraryTarget: 'amd',
            publicPath: '', // Set in amd-public-path.js
        },
        devtool: 'source-map',
        externals: externals,
        resolve: {
            extensions: [ '.autogen.js', '.js' ]
        },

    },
    {
        // embeddable jupyter-threejs bundle (e.g. for docs)
        entry: ['./amd-public-path.js', './src/index.js'],
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist'),
            library: 'jupyter-threejs',
            libraryTarget: 'amd',
            publicPath: '', // Set in amd-public-path.js
        },
        externals: ['@jupyter-widgets/base', 'module'],
        resolve: {
            extensions: [ '.autogen.js', '.js' ]
        },

    },

];
