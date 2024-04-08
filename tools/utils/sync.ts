/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Synchronizes state between two directories
 */

import fs from 'fs';
import path from 'path';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

const argv = yargs(hideBin(process.argv))
	.option('source', {
		type: 'string',
		demandOption: true,
		description: 'Work directory'
	})
	.option('target', {
		type: 'string',
		demandOption: true,
		description: 'Target directory'
	})
	.parseSync();

const source = path.resolve(argv.source);
const target = path.resolve(argv.target);

fs.watch(source, { recursive: true }, (event, filename) => {
	if (!filename) {
		return;
	}

	if (event === 'change') {
		console.log(
			'Copy:',
			path.resolve(source, filename),
			path.resolve(target, filename)
		);
		fs.cpSync(
			path.resolve(source, filename),
			path.resolve(target, filename)
		);
	}
});

const exclude = new Set(['node_modules', 'build', '.idea', '.git']);

function sync(folder: string): void {
	const files = fs.readdirSync(folder, { withFileTypes: true });
	for (const file of files) {
		const full = path.resolve(folder, file.name);

		if (file.isDirectory()) {
			exclude.has(file.name) || sync(full);
		} else {
			const filepath = path.relative(source, full);
			const targetFull = path.resolve(target, filepath);
			if (!fs.existsSync(targetFull)) {
				console.log('Not exists', targetFull);
				fs.cpSync(full, targetFull);
			} else {
				const contentSource = fs.readFileSync(full, 'utf-8');
				const contentTarget = fs.readFileSync(targetFull, 'utf-8');

				if (contentSource !== contentTarget) {
					console.log('Diff', targetFull);
					fs.cpSync(full, targetFull);
				}
			}
		}
	}
}

sync(source);
