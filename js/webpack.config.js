var loaders = [
    { test: /\.json$/, loader: "json-loader" }
];

module.exports = [
    {
        // Notebook extension
        entry: './src/extension.js',
        output: {
            filename: 'extension.js',
            path: '../pythreejs/static',
            libraryTarget: 'amd'
        },
        resolve: {
            extensions: [ "", ".autogen.js", ".js" ]
        },
    },
    {
        // jupyter-threejs bundle for the notebook
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
        externals: ['@jupyter-widgets/base'],
        resolve: {
            extensions: [ "", ".autogen.js", ".js" ]
        },

    },
    {
        // embeddable jupyter-threejs bundle
        entry: './src/index.js',
        output: {
            filename: 'index.js',
            path: './dist/',
            libraryTarget: 'amd'
        },
        devtool: 'source-map',
        module: {
            loaders: loaders
        },
        externals: ['@jupyter-widgets/base'],
        resolve: {
            extensions: [ "", ".autogen.js", ".js" ]
        },

    },
    {
        // embeddable jupyter-threejs bundle
        entry: './src/index.js',
        output: {
            filename: 'index.standalone.js',
            path: './dist/',
        },
        devtool: 'source-map',
        module: {
            loaders: loaders
        },
        resolve: {
            extensions: [ "", ".autogen.js", ".js" ]
        },

    }

];
