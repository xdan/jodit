/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

// eslint-disable-next-line strict
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'header'],
	extends: [
		'eslint:recommended',
		'plugin:prettier/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended'
	],
	env: {
		browser: true,
		node: true
	},
	rules: {
		strict: ['error', 'never'],
		'no-with': 'error',
		'no-caller': 'error',
		'no-delete-var': 'error',
		'no-proto': 'off',
		'valid-typeof': 'error',
		'no-undef': 'off',
		eqeqeq: ['error', 'always', { null: 'never' }],

		'no-new': 'error',
		'no-new-func': 'error',
		'no-new-object': 'error',
		'no-new-symbol': 'error',
		'no-new-wrappers': 'error',
		'no-array-constructor': 'error',
		'new-parens': 'error',
		'max-classes-per-file': ['error', 1],

		'no-extend-native': 'off',
		'no-global-assign': 'error',
		'no-implicit-globals': 'error',
		'no-implicit-coercion': 'error',
		camelcase: 'off',
		quotes: ['error', 'single', { avoidEscape: true }],
		'quote-props': [
			'error',
			'as-needed',
			{ keywords: false, numbers: false }
		],
		'jsx-quotes': 'error',

		'header/header': [2, 'src/header.js'],
		'no-mixed-spaces-and-tabs': 'off',
		'no-empty': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'no-fallthrough': 'off'
	},
	globals: {
		Set: true,
		setCursorToChar: true,
		createPoint: true,
		afterEach: true,
		SynchronousPromise: true,
		mocha: true,
		chai: true,
		Promise: true,
		defaultPermissions: true,
		getOpenedPopup: true,
		getOpenedDialog: true,
		getBox: true,
		offset: true,
		i18nkeys: true,
		appendTestDiv: true,
		getButton: true,
		clickTrigger: true,
		clickButton: true,
		sortAttributes: true,
		onLoadImage: true,
		sortStyles: true,
		simulateEvent: true,
		simulatePaste: true,
		beforeEach: true,
		describe: true,
		it: true,
		getJodit: true,
		Jodit: true,
		expect: true,
		unmockPromise: true,
		appendTestArea: true,
		mockPromise: true,
		fillBoxBr: true,
		selectCells: true,
		before: true,
		after: true,
		FileImage: true,
		FileXLS: true
	}
};
