/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { checkSections } from '../loaders/process-sections';

const argv = yargs(hideBin(process.argv))
	.option('cwd', {
		type: 'string',
		demandOption: true,
		description: 'Work directory'
	})
	.option('ver', {
		type: 'string',
		demandOption: true,
		description: 'Version of Jodit'
	})
	.parseSync();

const globalMaps = {
	'process.env.FAT_MODE': false,
	'process.env.APP_VERSION': argv.ver,
	'process.env.TARGET_ES': 'es2020',
	'process.env.IS_ES_MODERN': true,
	'process.env.IS_ES_NEXT': true,
	'process.env.IS_PROD': true,
	'process.env.IS_TEST': false,
	'process.env.HOMEPAGE': 'https://xdsoft.net/jodit/'
} as const;

const cwd = path.resolve(argv.cwd);
if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	throw new Error('Invalid types directory');
}

const alias = /^(jodit)/;
const allowPackages = new Set([
	'a-color-picker',
	'autobind-decorator',
	'classlist-polyfill',
	'es6-promise/auto',
	'core-js/es/symbol',
	'core-js/es/array/find-index',
	'core-js/es/array/from'
]);

const allowPluginsInESM = new Set(
	[
		'about',
		'backspace',
		'delete',
		'color',
		'format-block',
		'image',
		'ordered-list',
		'dtd',
		'enter',
		'enter',
		'link',
		'iframe',
		'hotkeys',
		'powered-by-jodit',
		'redo-undo',
		'size',
		'wrap-nodes',
		'font'
	].map(p => `jodit/plugins/${p}/${p}`)
);

const allowLanguagesInESM = new Set([
	'jodit/langs/en',
	'jodit/core/helpers/checker/is-array'
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

		const isJs = /.(js)$/.test(file.name);

		const content = checkSections(fs.readFileSync(filePath, 'utf8'), {
			POLYFILLS: false
		});

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

			// For esm add extension
			if (
				isJs &&
				!modulePath.endsWith('.js') &&
				!allowPackages.has(modulePath)
			) {
				const fullPath = path.resolve(dirPath, modulePath);

				if (
					fs.existsSync(fullPath) &&
					fs.statSync(fullPath).isDirectory()
				) {
					modulePath +=
						(!modulePath.endsWith('/') ? '/' : '') + 'index.js';
				} else {
					modulePath += '.js';
				}
			}

			return modulePath;
		};

		const transformer = (
			ctx: ts.TransformationContext
		): ts.Transformer<any> => {
			return (src: ts.SourceFile): ts.SourceFile => {
				const visit = (node: ts.Node): ts.Node => {
					if (
						ts.isPropertyAccessExpression(node) &&
						/process\.env/.test(node.getFullText())
					) {
						const name = node
							.getFullText()
							.trim() as keyof typeof globalMaps;

						if (!(name in globalMaps)) {
							throw Error(`Unknown variable: ${name}`);
						}

						const bool = globalMaps[name]
							? ts.factory.createTrue()
							: ts.factory.createFalse();

						return typeof globalMaps[name] === 'boolean'
							? bool
							: ts.factory.createStringLiteral(
									globalMaps[name].toString()
							  );
					}

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

					if (
						ts.isCallExpression(node) &&
						node.expression.getText() === 'require'
					) {
						return ts.factory.updateCallExpression(
							node,
							node.expression,
							node.typeArguments,
							[
								ts.factory.createStringLiteral(
									resolvePath(node.arguments[0].getText())
								)
							]
						);
					}

					if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
						if (isJs) {
							node = allowImportsPluginsAndLanguagesInESM(node);

							if (
								!ts.isImportDeclaration(node) ||
								!node.moduleSpecifier
							) {
								return node;
							}
						}

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

function allowImportsPluginsAndLanguagesInESM(
	node: ts.ImportDeclaration
): ts.Node {
	const filePath = node.moduleSpecifier.getText().replace(/['"]/g, '');

	if (node.getSourceFile().fileName.includes('langs/index')) {
		if (!allowLanguagesInESM.has(filePath)) {
			if (/jodit\/langs\//.test(filePath)) {
				return ts.factory.createVariableDeclarationList(
					[
						ts.factory.createVariableDeclaration(
							ts.factory.createIdentifier(
								node.importClause?.getText() ?? ''
							),
							undefined,
							undefined,
							ts.factory.createObjectLiteralExpression()
						)
					],
					ts.NodeFlags.Const
				);
			}
			return ts.factory.createIdentifier('');
		}
	}

	if (node.getSourceFile().fileName.includes('plugins/index')) {
		if (!allowPluginsInESM.has(filePath)) {
			return ts.factory.createIdentifier('');
		}
	}

	return node;
}
