/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';

const cwd = path.resolve(process.argv[2]);
if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	throw new Error('Invalid types directory');
}

const alias = /^(jodit)/;
const allowPackages = new Set([
	'tslib',
	'autobind-decorator',
	'classlist-polyfill',
	'es6-promise/auto',
	'core-js/es/symbol',
	'core-js/es/array/find-index',
	'core-js/es/array/from'
]);

resoleAliasImports(cwd);

function resoleAliasImports(dirPath: string): void {
	fs.readdirSync(dirPath, { withFileTypes: true }).forEach((file): void => {
		const filePath = path.join(dirPath, file.name);

		if (file.isDirectory()) {
			return resoleAliasImports(filePath);
		}

		if (!/.(ts|js)$/.test(file.name)) {
			return;
		}

		const content = fs.readFileSync(filePath, 'utf8');

		const sourceFile = ts.createSourceFile(
			filePath,
			content,
			ts.ScriptTarget.Latest,
			true
		);

		const resolvePath = (str: string): string => {
			let modulePath = str.replace(/['"]/g, '');

			if (alias.test(modulePath)) {
				modulePath = resolveAlias(modulePath, dirPath);
			}

			if (!modulePath.startsWith('.') && !allowPackages.has(modulePath)) {
				throw new Error(
					`Allow only relative paths file:${filePath} import: ${modulePath}`
				);
			}

			return modulePath;
		};

		const transformer = ctx => {
			return src => {
				const visit = (node: ts.Node): ts.Node => {
					if (
						ts.isLiteralTypeNode(node) &&
						node.parent?.kind === ts.SyntaxKind.LastTypeNode &&
						node.literal?.getText()
					) {
						const newPath = resolvePath(node.literal.getText());
						return ts.factory.updateLiteralTypeNode(
							node,
							ts.factory.createStringLiteral(newPath)
						);
					}

					if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
						const newPath = resolvePath(
							node.moduleSpecifier.getText()
						);
						return ts.factory.updateImportDeclaration(
							node,
							node.modifiers,
							node.importClause,
							ts.factory.createStringLiteral(newPath),
							node.assertClause
						);
					}

					if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
						const newPath = resolvePath(
							node.moduleSpecifier.getText()
						);
						return ts.factory.updateExportDeclaration(
							node,
							node.modifiers,
							node.isTypeOnly,
							node.exportClause,
							ts.factory.createStringLiteral(newPath),
							node.assertClause
						);
					}

					return node;
				};

				const visitChild = (node: ts.Node): ts.Node => {
					return ts.visitEachChild(visit(node), visitChild, ctx);
				};

				return ts.visitEachChild(src, visitChild, ctx);
			};
		};

		const { transformed } = ts.transform(sourceFile, [transformer]);
		const printer = ts.createPrinter({
			newLine: ts.NewLineKind.LineFeed,
			removeComments: false
		});
		const newContent = printer.printNode(
			ts.EmitHint.Unspecified,
			transformed[0],
			sourceFile
		);

		fs.writeFileSync(filePath, newContent);
	});
}

function resolveAlias(pathWithAlias: string, dirPath: string): string {
	const relPath = pathWithAlias.replace(alias, '');
	const subPath = path.join(
		cwd,
		relPath.startsWith('/') ? '.' + relPath : relPath
	);
	const relative = path.relative(dirPath, subPath);
	return relative.startsWith('.') ? relative : `./${relative}`;
}
