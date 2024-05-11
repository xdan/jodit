/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as path from 'path';

const sourceDir = path.resolve(process.argv[2]);
if (!fs.existsSync(sourceDir) || !fs.statSync(sourceDir).isDirectory()) {
	throw new Error('Invalid directory');
}

const targetDir = path.resolve(process.argv[3]);
if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
	throw new Error('Invalid directory');
}

function readAndCopyDeclarations(dir: string): void {
	const fullDir = path.join(sourceDir, dir);

	fs.readdirSync(fullDir, { withFileTypes: true }).forEach((file): void => {
		const sourcePath = path.join(sourceDir, dir, file.name);

		if (file.isDirectory()) {
			return readAndCopyDeclarations(path.join(dir, file.name));
		}

		if (/\.d\.ts$/.test(file.name)) {
			const targetPath = path.join(targetDir, dir, file.name);

			if (fs.existsSync(targetPath)) {
				return;
			}

			fs.mkdirSync(path.join(targetDir, dir), { recursive: true });

			// eslint-disable-next-line no-console
			console.log(
				'Copy:',
				path.join(fullDir, file.name),
				'->',
				targetPath
			);

			fs.copyFileSync(sourcePath, targetPath);
		}
	});
}

readAndCopyDeclarations('');
