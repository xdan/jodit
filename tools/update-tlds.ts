/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Rewrites the endings in src/plugins/link/tlds.ts from IANA's list of
 * top-level domains, for typed links, and prints those added and removed. The
 * file changes only when the endings do, not with each version of the list
 * Usage: make tlds
 */

import * as fs from 'fs';
import * as path from 'path';

const SOURCE = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt';
const TARGET = path.resolve(process.cwd(), 'src/plugins/link/tlds.ts');
const START = 'new Set(\n\t`\n';
const END = '\n`\n';

async function update(): Promise<void> {
	const response = await fetch(SOURCE);

	if (!response.ok) {
		throw new Error(`${SOURCE} answered ${response.status}`);
	}

	const list = await response.text();
	const version = /^# Version (\d+)/.exec(list)?.[1];
	const endings = list
		.split('\n')
		.map(line => line.trim().toLowerCase())
		.filter(
			line => line && !line.startsWith('#') && !line.startsWith('xn--')
		);

	if (!version || !endings.includes('com')) {
		throw new Error(`${SOURCE} isn't the list of top-level domains`);
	}

	const file = fs.readFileSync(TARGET, 'utf8');
	const start = file.indexOf(START) + START.length;
	const end = file.indexOf(END, start);
	const before = file.slice(start, end).trim().split(/\s+/);
	const added = endings.filter(ending => !before.includes(ending));
	const removed = before.filter(ending => !endings.includes(ending));

	if (!added.length && !removed.length) {
		// eslint-disable-next-line no-console
		console.log(`tlds.ts has every ending in IANA's version ${version}`);
		return;
	}

	fs.writeFileSync(
		TARGET,
		file.slice(0, start).replace(/\b\d{10}\b/, version) +
			wrap(endings) +
			file.slice(end)
	);

	// eslint-disable-next-line no-console
	console.log(
		`tlds.ts now has IANA's version ${version}.\n` +
			`Added: ${added.join(' ') || 'none'}\n` +
			`Removed: ${removed.join(' ') || 'none'}`
	);
}

/**
 * Lines of endings, indented with a tab, that fit in 80 columns
 */
function wrap(endings: string[]): string {
	const lines = [''];

	for (const ending of endings) {
		const line = lines[lines.length - 1];

		if (!line) {
			lines[lines.length - 1] = ending;
		} else if (4 + line.length + 1 + ending.length > 80) {
			lines.push(ending);
		} else {
			lines[lines.length - 1] = `${line} ${ending}`;
		}
	}

	return lines.map(line => `\t${line}`).join('\n');
}

update();
