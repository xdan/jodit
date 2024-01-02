/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as ts from 'typescript';

export const removeAsserts = function removeAsserts(
	names = new Set(['assert'])
) {
	return (ctx: ts.TransformationContext): ts.Transformer<any> => {
		const visitor = (node: ts.Node): ts.Node => {
			if (
				ts.isCallExpression(node) &&
				names.has(node.expression.getText())
			) {
				return ts.factory.createVoidZero();
			}

			return ts.visitEachChild(node, visitor, ctx);
		};

		return (file: ts.SourceFile): ts.Node =>
			ts.visitEachChild(file, visitor, ctx);
	};
};
