/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as path from 'path';

const cwd = path.resolve(process.argv[2]);
if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	throw new Error('Invalid directory');
}

const esmDir = path.resolve(process.argv[3]);
if (!fs.existsSync(esmDir) || !fs.statSync(esmDir).isDirectory()) {
	throw new Error('Invalid directory');
}

function readAndCopyIcons(dir: string): void {
	const fullDir = path.join(cwd, dir);

	fs.readdirSync(fullDir, { withFileTypes: true }).forEach((file): void => {
		if (file.isDirectory()) {
			return readAndCopyIcons(path.join(dir, file.name));
		}

		if (/\.(svg)$/.test(file.name)) {
			const content = fs.readFileSync(
				path.join(fullDir, file.name),
				'utf8'
			);

			console.log(
				'Copy:',
				path.join(fullDir, file.name),
				'->',
				path.join(esmDir, dir, file.name.replace(/.svg$/, '.js'))
			);

			fs.mkdirSync(path.join(esmDir, dir), { recursive: true });

			const targetPath = path.join(esmDir, dir, file.name + '.js');

			if (fs.existsSync(targetPath)) {
				throw new Error(`File ${targetPath} already exists`);
			}

			fs.writeFileSync(
				targetPath,
				`export default ${JSON.stringify(
					content.replace(/[\n\t]|\s{4}/g, '')
				)};`
			);
		}
	});
}

readAndCopyIcons('');
