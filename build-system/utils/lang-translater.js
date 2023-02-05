/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

const { argv } = require('yargs')
	.option('command', {
		alias: 'c',
		type: 'string',
		required: true,
		description: 'Command: translate, move'
	})
	.option('dir', {
		type: 'string',
		default: path.resolve(process.cwd(), 'src/langs'),
		description: 'Directory'
	})
	.example([
		[
			'npm run translate -- --command move --key symbol --dir ./src/plugins/symbols/langs --key-to symbols'
		],
		[
			'npm run translate -- --str="Press Alt for custom resizing" --ytak=<key> --folder=<folder> --dir=./src/plugins/symbols/langs'
		]
	]);

console.info('Work directory:', argv.dir);

require(path.resolve(__dirname, `./lang/${argv.command}.js`))();
