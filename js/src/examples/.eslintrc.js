module.exports = {
	'env': {
		'browser': true,
		'commonjs': true
	},
	'extends': 'eslint:recommended',
	'rules': {
		'indent': [
			'error',
			'tab'
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
		'no-unused-vars': 'warn',
		'no-undef': 'warn',
		'no-redeclare': 'warn',
	}
};
