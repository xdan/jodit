/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const ts = require('typescript');

module.exports.removeAsserts = function removeAsserts(
	names = new Set(['assert'])
) {
	return ctx => {
		const visitor = node => {
			if (
				ts.isCallExpression(node) &&
				names.has(node.expression.getText())
			) {
				return ts.factory.createVoidZero();
			}

			return ts.visitEachChild(node, visitor, ctx);
		};

		return file => ts.visitEachChild(file, visitor, ctx);
	};
};
