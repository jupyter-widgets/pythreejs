var loaders = [
    { test: /\.json$/, loader: "json-loader" },
];

module.exports = [
    {// Notebook extension
        entry: './src/extension.js',
        output: {
            filename: 'extension.js',
            path: '../pythreejs/static',
            libraryTarget: 'amd'
        }
    },
    {// jupyter-threejs bundle for the notebook
        entry: './src/index.js',
        output: {
            filename: 'index.js',
            path: '../pythreejs/static',
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        module: {
            loaders: loaders
        },
        externals: ['@jupyter-widgets/base', 'three']
    },
    {// embeddable jupyter-threejs bundle
        entry: './src/embed.js',
        output: {
            filename: 'index.js',
            path: './dist/',
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        module: {
            loaders: loaders
        },
        externals: ['@jupyter-widgets/base', 'three']
    },
    {//standalone threejs module
        entry: 'three',
        output: {
            filename: 'three.js',
            path: '../pythreejs/static',
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        module: {
            loaders: loaders
        }
    },
];
