/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import prettierConfig from '../../.prettierrc.json';

import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import * as ts from 'typescript';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const argv = yargs(hideBin(process.argv))
	.option('cwd', {
		type: 'string',
		demandOption: true,
		description: 'Work directory'
	})
	.option('esmDir', {
		type: 'string',
		demandOption: true,
		description: 'ESM directory'
	})
	.parseSync();

const cwd = path.resolve(argv.cwd);
if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	throw new Error('Invalid types directory');
}

const options: string[] = [];
const imports: Record<string, string> = {};

collectOptions(cwd, options, imports);

const configPath = path.join(argv.esmDir, 'config.d.ts');
const content = fs.readFileSync(configPath, 'utf-8');
const configSource = ts.createSourceFile(
	configPath,
	content,
	ts.ScriptTarget.ESNext,
	true
);

const configImports = getImportDeclarations(configSource);
const allImports = { ...imports, ...configImports };

delete allImports['Config'];

void writeNewConfigFile(configPath, configSource, options, allImports);

function collectOptions(
	dir: string,
	options: string[],
	collectedImports: Record<string, string>
): void {
	const files = fs.readdirSync(dir);

	files.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			return collectOptions(filePath, options, collectedImports);
		}

		if (stat.isFile() && file.endsWith('.ts')) {
			const content = fs.readFileSync(filePath, 'utf-8');
			const source = ts.createSourceFile(
				file,
				content,
				ts.ScriptTarget.ESNext,
				true
			);

			visitAllNodes(source, source, options, collectedImports);
		}
	});
}

function visitAllNodes(
	sourceFile: ts.SourceFile,
	node: ts.Node,
	options: string[],
	collectedImports: Record<string, string>
): void {
	if (ts.isInterfaceDeclaration(node)) {
		if (node.name.text === 'Config') {
			options.push(node.getText());

			const definedImports = getImportDeclarations(sourceFile);
			getAllDependencies(node, collectedImports, definedImports);
		}
	}

	ts.forEachChild(node, childNode =>
		visitAllNodes(sourceFile, childNode, options, collectedImports)
	);
}

function getImportDeclarations(
	sourceFile: ts.SourceFile
): Record<string, string> {
	const imports: Record<string, string> = {};

	ts.forEachChild(sourceFile, node => {
		if (ts.isImportDeclaration(node)) {
			const importClause = node.importClause;
			if (importClause) {
				const namedBindings = importClause.namedBindings;
				if (namedBindings) {
					if (ts.isNamedImports(namedBindings)) {
						namedBindings.elements.forEach(element => {
							let importPath = node.moduleSpecifier.getText();

							if (/^['"]/.test(importPath)) {
								importPath = importPath.slice(1, -1);
							}

							imports[element.name.text] = importPath;
						});
					}
				}
			}
		}
	});

	return imports;
}

function getAllDependencies(
	node: ts.Node,
	collectedImports: Record<string, string>,
	definedImports: Record<string, string>
): void {
	ts.forEachChild(node, childNode => {
		const importName = childNode.getText();
		if (definedImports[importName]) {
			collectedImports[importName] = definedImports[importName];

			if (definedImports[importName].startsWith('.')) {
				console.error(
					`Relative imports are not allowed ${definedImports[importName]} in ${node.getSourceFile().fileName}`
				);
			}
		}

		getAllDependencies(childNode, collectedImports, definedImports);
	});
}

async function writeNewConfigFile(
	configPath: string,
	sourceFile: ts.SourceFile,
	options: string[],
	allImports: Record<string, string>
): Promise<void> {
	const printer = ts.createPrinter({
		newLine: ts.NewLineKind.CarriageReturnLineFeed
	});

	const statementsWithoutImports = sourceFile.statements.filter(
		stmt => !ts.isImportDeclaration(stmt)
	);

	const newImportStatements = Object.entries(allImports).map(([name, path]) =>
		ts.factory.createImportDeclaration(
			undefined,
			ts.factory.createImportClause(
				true,
				undefined,
				ts.factory.createNamedImports([
					// Создаём именованный импорт
					ts.factory.createImportSpecifier(
						false,
						undefined,
						ts.factory.createIdentifier(name)
					)
				])
			),
			ts.factory.createStringLiteral(path)
		)
	);

	const updatedStatements = [
		...newImportStatements,
		...statementsWithoutImports
	];

	const newSourceFile = ts.factory.updateSourceFile(
		sourceFile,
		updatedStatements
	);

	const newCode = printer.printFile(newSourceFile);

	fs.writeFileSync(
		configPath.replace('config', 'config2'),
		await prettier.format(newCode + '\n' + options.join('\n'), {
			...(prettierConfig as prettier.Options),
			parser: 'typescript'
		}),
		{
			encoding: 'utf-8'
		}
	);
}
