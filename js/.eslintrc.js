module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es2018': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'ignorePatterns': ['dist/**/*', 'lab-dist/**/*'],
    'globals': {
        '__webpack_public_path__': true
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 'off',
        'no-unused-vars': ['warn', { 'args': 'none' }],
        'prefer-object-spread': 'error',
    },
    'overrides': [
        {
            'files': [ 'src/**/*.autogen.js' ],
            'rules': {
                'quotes': 0,
                'linebreak-style': 0,
                'no-unused-vars': 0,
            }
        }
    ]
};
