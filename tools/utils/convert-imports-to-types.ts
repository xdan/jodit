/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import fs from 'node:fs';
import path from 'node:path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const argv = yargs(hideBin(process.argv))
	.option('cwd', {
		type: 'string',
		demandOption: true,
		description: 'Work directory'
	})
	.parseSync();

const cwd = path.resolve(argv.cwd);

convertImportsToTypes(cwd);

function convertImportsToTypes(dir: string): void {
	fs.readdirSync(dir, {
		withFileTypes: true
	}).forEach((file): void => {
		const sourcePath = path.join(dir, file.name);

		if (file.isDirectory()) {
			return convertImportsToTypes(sourcePath);
		}

		const content = fs.readFileSync(sourcePath, 'utf-8');

		const newContent = [
			replaceNamedImport,
			replaceDefaultImport,
			replaceStarImport,
			replaceStarExport,
			replaceNamedExport
		].reduce((acc, fn) => fn(acc), content);

		if (newContent === content) {
			return;
		}

		fs.writeFileSync(sourcePath, newContent);
	});
}

function replaceNamedImport(content: string): string {
	const regImport = /import \{([^}]+)} from (['"])(.*)\2;/g;
	if (!regImport.test(content)) {
		return content;
	}

	return content.replace(regImport, 'import type { $1 } from $2$3$2;');
}

function replaceDefaultImport(content: string): string {
	const regImport = /import (\w+) from (['"])(.*)\2;/g;
	if (!regImport.test(content)) {
		return content;
	}

	return content.replace(regImport, 'import type $1 from $2$3$2;');
}

function replaceStarImport(content: string): string {
	const regImport = /import \* as (\w+) from (['"])(.*)\2;/g;
	if (!regImport.test(content)) {
		return content;
	}

	return content.replace(regImport, 'import type * as $1 from $2$3$2;');
}

function replaceStarExport(content: string): string {
	const reg = /export \* from (['"])(.*)\1;/g;
	if (!reg.test(content)) {
		return content;
	}

	return content.replace(reg, 'export type * from $1$2$1;');
}

function replaceNamedExport(content: string): string {
	const reg = /export \{([^}]+)} from (['"])(.*)\2;/g;
	if (!reg.test(content)) {
		return content;
	}

	return content.replace(reg, 'export type {$1} from $2$3$2;');
}
