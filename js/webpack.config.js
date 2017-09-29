var path = require('path');

module.exports = [
    {// Notebook extension
        entry: './src/extension.js',
        output: {
            filename: 'extension.js',
            path: path.resolve(__dirname, '..', 'pythreejs', 'static'),
            libraryTarget: 'amd'
        }
    },
    {// jupyter-threejs bundle for the notebook
        entry: './src/index.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, '..', 'pythreejs', 'static'),
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        externals: ['@jupyter-widgets/base']
    },
    {// embeddable jupyter-threejs bundle
        entry: './src/index.js',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'dist'),
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        externals: ['@jupyter-widgets/base']
    }
];
