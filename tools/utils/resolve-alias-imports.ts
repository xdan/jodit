/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { checkSections } from '../loaders/process-sections';

import * as fs from 'fs';
import * as path from 'path';
import type {
	FalseLiteral,
	NumericLiteral,
	ObjectLiteralExpression,
	StringLiteral,
	TrueLiteral
} from 'typescript';
import * as ts from 'typescript';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const argv = yargs(hideBin(process.argv))
	.option('cwd', {
		type: 'string',
		demandOption: true,
		description: 'Work directory'
	})
	.option('rootDir', {
		type: 'string',
		demandOption: true,
		description: 'Root directory'
	})
	.option('mode', {
		demandOption: true,
		choices: ['esm', 'dts'],
		description: 'ESM or DTS'
	})
	.option('ver', {
		type: 'string',
		demandOption: true,
		description: 'Version of Jodit'
	})
	.parseSync();

const globalMaps: Record<
	string,
	boolean | string | number | Record<string, boolean | string | number>
> = {
	'process.env.FAT_MODE': false,
	'process.env.APP_VERSION': argv.ver,
	'process.env.TARGET_ES': 'es2020',
	'process.env.IS_ES_MODERN': true,
	'process.env.IS_ES_NEXT': true,
	'process.env.IS_PROD': true,
	'process.env.IS_TEST': false,
	'process.env.TOKENS': {},
	'process.env.HOMEPAGE': 'https://xdsoft.net/jodit/'
} as const;

const cwd = path.resolve(argv.cwd);
if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	throw new Error('Invalid types directory');
}

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
		'bold',
		'color',
		'delete',
		'dtd',
		'enter',
		'font',
		'format-block',
		'hotkeys',
		'iframe',
		'image',
		'inline-popup',
		'link',
		'ordered-list',
		'placeholder',
		'powered-by-jodit',
		'redo-undo',
		'size',
		'stat',
		'table',
		'wrap-nodes'
	]
		.map(p => `jodit/plugins/${p}/${p}`)
		.concat(
			['autocomplete', 'paste-from-word', 'license'].map(
				p => `jodit-pro/plugins/${p}/${p}`
			)
		)
);

const tsConfig = JSON.parse(
	fs.readFileSync(
		path.resolve(
			argv.rootDir,
			`tsconfig${argv.mode === 'esm' ? '.esm' : ''}.json`
		),
		'utf8'
	)
);

const allowLanguagesInESM = new Set(['jodit/langs/en']);

const CHECK_EXTENSIONS = ['', '.js', '.ts', '.d.ts', '.svg', '.css'];
CHECK_EXTENSIONS.push(...CHECK_EXTENSIONS.map(e => '/index' + e));

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

		const content = checkSections(fs.readFileSync(filePath, 'utf8'), {
			POLYFILLS: false
		});

		const sourceFile = ts.createSourceFile(
			filePath,
			content,
			ts.ScriptTarget.Latest,
			true
		);

		const f = ts.factory;

		const transformer = (
			ctx: ts.TransformationContext
		): ts.Transformer<any> => {
			return (src: ts.SourceFile): ts.SourceFile => {
				const visit = (node: ts.Node): ts.Node => {
					if (
						ts.isPropertyAccessExpression(node) &&
						/process\.env/.test(node.getFullText())
					) {
						return resolveWebpackEnvs(node, f);
					}

					if (
						ts.isLiteralTypeNode(node) &&
						node.parent?.kind === ts.SyntaxKind.LastTypeNode &&
						node.literal?.getText()
					) {
						const newPath = resolvePath(
							node.literal.getText(),
							filePath
						);
						return f.updateLiteralTypeNode(
							node,
							f.createStringLiteral(newPath)
						);
					}

					if (
						ts.isCallExpression(node) &&
						node.expression.getText() === 'require'
					) {
						return f.updateCallExpression(
							node,
							node.expression,
							node.typeArguments,
							[
								f.createStringLiteral(
									resolvePath(
										node.arguments[0].getText(),
										filePath
									)
								)
							]
						);
					}

					if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
						if (argv.mode === 'esm') {
							node = allowImportsPluginsAndLanguagesInESM(node);

							if (
								!ts.isImportDeclaration(node) ||
								!node.moduleSpecifier
							) {
								return node;
							}
						}

						const newPath = resolvePath(
							node.moduleSpecifier.getText(),
							filePath
						);

						return f.updateImportDeclaration(
							node,
							node.modifiers,
							node.importClause,
							f.createStringLiteral(newPath),
							node.assertClause
						);
					}

					if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
						const newPath = resolvePath(
							node.moduleSpecifier.getText(),
							filePath
						);

						return f.updateExportDeclaration(
							node,
							node.modifiers,
							node.isTypeOnly,
							node.exportClause,
							f.createStringLiteral(newPath),
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

function resolveAlias(
	pathWithAlias: string,
	dirPath: string
): {
	isPackage?: boolean;
	originalPath: string;
	relativePath: string;
	absolutePath: string;
} {
	if (allowPackages.has(pathWithAlias)) {
		return {
			isPackage: true,
			originalPath: pathWithAlias,
			relativePath: pathWithAlias,
			absolutePath: path.resolve(
				argv.rootDir,
				'node_modules',
				pathWithAlias
			)
		};
	}

	if (pathWithAlias.startsWith('.')) {
		for (const ext of CHECK_EXTENSIONS) {
			if (fs.existsSync(path.resolve(dirPath, pathWithAlias + ext))) {
				return {
					originalPath: pathWithAlias,
					relativePath: pathWithAlias + ext,
					absolutePath: path.resolve(dirPath, pathWithAlias + ext)
				};
			}

			if (argv.mode !== 'esm' && pathWithAlias.endsWith('.js')) {
				if (
					fs.existsSync(
						path.resolve(
							dirPath,
							pathWithAlias.replace(/.js$/, ext)
						)
					)
				) {
					return {
						originalPath: pathWithAlias,
						relativePath: pathWithAlias.replace(/.js$/, ext),
						absolutePath: path.resolve(
							dirPath,
							pathWithAlias.replace(/.js$/, ext)
						)
					};
				}
			}
		}

		throw `Relative path ${pathWithAlias} not found in ${dirPath}`;
	}

	for (const ext of CHECK_EXTENSIONS) {
		const fullPath = path.resolve(
			argv.rootDir,
			'node_modules',
			pathWithAlias + ext
		);

		if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
			return {
				isPackage: true,
				originalPath: pathWithAlias,
				relativePath: pathWithAlias + ext,
				absolutePath: path.resolve(
					argv.rootDir,
					'node_modules',
					pathWithAlias + ext
				)
			};
		}
	}

	for (const key in tsConfig.compilerOptions.paths) {
		const keyRegExp = RegExp(key.replace(/\*/g, '(.*)'));
		const parts = keyRegExp.exec(pathWithAlias);
		if (parts) {
			const relPath = parts[1];
			for (const aliasPath of tsConfig.compilerOptions.paths[key]) {
				const resolvedPath = aliasPath
					.replace(/^\.\/src/, './') // Because rootPath is src
					.replace(/\*/, relPath);

				const fullPath = path.resolve(argv.cwd, resolvedPath);

				for (const ext of CHECK_EXTENSIONS) {
					if (fs.existsSync(fullPath + ext)) {
						const relativePath = path.relative(
							dirPath,
							fullPath + ext
						);

						return {
							originalPath: pathWithAlias,
							relativePath: relativePath.startsWith('.')
								? relativePath
								: `./${relativePath}`,
							absolutePath: fullPath + ext
						};
					}
				}
			}
		}
	}

	throw `Alias ${pathWithAlias} not found`;
}

function allowImportsPluginsAndLanguagesInESM(
	node: ts.ImportDeclaration
): ts.Node {
	const filePath = node.moduleSpecifier.getText().replace(/['"]/g, '');

	if (
		/jodit\/langs\//.test(filePath) &&
		node.getSourceFile().fileName.includes('langs/index')
	) {
		if (!allowLanguagesInESM.has(filePath)) {
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
			// return ts.factory.createIdentifier('');
		}
	}

	if (node.getSourceFile().fileName.includes('plugins/index')) {
		if (!allowPluginsInESM.has(filePath)) {
			return ts.factory.createIdentifier('');
		}
	}

	return node;
}

function resolvePath(str: string, filePath: string): string {
	const dirPath = path.dirname(filePath);

	let modulePath = str.replace(/['"]/g, '');

	if (/^\..+\.svg$/.test(modulePath)) {
		return modulePath + '.js';
	}

	const moduleInfo = resolveAlias(modulePath, dirPath);
	modulePath = moduleInfo.relativePath;

	if (!modulePath.startsWith('.') && !moduleInfo.isPackage) {
		throw new Error(
			`Allow only relative paths file:${filePath} import: ${modulePath}`
		);
	}

	// For esm add extension
	if (
		argv.mode === 'esm' &&
		!modulePath.endsWith('.js') &&
		!moduleInfo.isPackage
	) {
		const fullPath = moduleInfo.absolutePath;

		const isDir =
			fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();

		if (isDir) {
			modulePath += (!modulePath.endsWith('/') ? '/' : '') + 'index.js';
		} else {
			modulePath += '.js';
		}
	}

	return modulePath;
}

function resolveWebpackEnvs(
	node: ts.PropertyAccessExpression,
	f: ts.NodeFactory
):
	| ObjectLiteralExpression
	| TrueLiteral
	| FalseLiteral
	| StringLiteral
	| NumericLiteral {
	const name = node.getFullText().trim() as keyof typeof globalMaps;

	if (!(name in globalMaps)) {
		throw Error(`Unknown variable: ${name}`);
	}

	const obj = globalMaps[name];
	if (typeof obj === 'boolean') {
		return obj ? f.createTrue() : f.createFalse();
	}

	if (typeof obj === 'string') {
		return f.createStringLiteral(obj);
	}

	if (typeof obj === 'number') {
		return f.createNumericLiteral(obj);
	}

	return f.createObjectLiteralExpression(
		Object.keys(obj).map(key => {
			const value = obj[key];
			return f.createPropertyAssignment(
				f.createIdentifier(key),
				typeof value === 'boolean'
					? value
						? f.createTrue()
						: f.createFalse()
					: typeof value === 'string'
						? f.createStringLiteral(value)
						: f.createNumericLiteral(value)
			);
		})
	);
}
