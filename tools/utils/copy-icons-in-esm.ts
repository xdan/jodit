/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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

		if (/\.(svg|json)$/.test(file.name)) {
			const isJSON = /\.(json)$/.test(file.name);
			const content = isJSON
				? require(path.join(fullDir, file.name))
				: fs
						.readFileSync(path.join(fullDir, file.name), 'utf8')
						.replace(/[\n\t\s]+/g, ' ');

			const targetPath = path.join(esmDir, dir, file.name + '.js');

			console.log(
				'Copy:',
				path.join(fullDir, file.name),
				'->',
				targetPath
			);

			fs.mkdirSync(path.join(esmDir, dir), { recursive: true });

			if (fs.existsSync(targetPath)) {
				throw new Error(`File ${targetPath} already exists`);
			}

			fs.writeFileSync(
				targetPath,
				`export default ${JSON.stringify(content)};`
			);
		}
	});
}

readAndCopyIcons('');
