/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const yargs = require('yargs');

const args = yargs
	.option('build', {
		type: 'string',
		demandOption: true,
		description: 'ES build'
	})
	.option('debug', {
		type: 'boolean',
		default: false,
		description: 'Debug mode'
	})
	.option('min', {
		type: 'boolean',
		default: true,
		description: 'Minify file'
	})
	.option('fat', {
		type: 'boolean',
		default: false,
		description: 'Fat file'
	})
	.parseSync();

if (!args.build) {
	throw new Error('Build type is not defined');
}

console.info('Build:', args.build);
console.info('Debug:', args.debug);
console.info('Fat:', args.fat);
console.info('Min:', args.min);

const fs = require('fs');
const expect = require('expect');
const path = require('path');
const toMatchImageSnapshot = import('expect-mocha-image-snapshot');
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

toMatchImageSnapshot.then(res => {
	expect.extend(res);
});

const port = 2003;
const host = `http://localhost:${port}`;

app.get('/', (req, res) => {
	res.send(
		fs
			.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
			.replace(/es2015/g, args.build)
			.replace(
				/jodit\.min/g,
				`jodit${args.fat ? '.fat' : ''}${args.min ? '.min' : ''}`
			)
	);
});

app.use('/', express.static(__dirname));
app.use(
	'/bootstrap.js',
	express.static(path.resolve(__dirname, '../bootstrap.js'))
);
app.use('/build', express.static(path.resolve(__dirname, '../../build')));

const listen = app.listen(port, error => {
	if (error) {
		console.error(error);
	}
});

let browser;

if (typeof before !== 'undefined') {
	before(async function () {
		this.timeout(10000);
		browser = await puppeteer.launch({
			headless: args.debug ? false : 'new',
			args: ['--disable-web-security', '--no-sandbox']
		});

		global.page = await browser.newPage();
		await global.page.setViewport({ width: 1200, height: 800 });
		await global.page.goto(host, { waitUntil: 'networkidle2' });
	});

	beforeEach(async function () {
		await global.page.reload({ waitUntil: 'networkidle2' });
		await page.evaluate(() => {
			window.editor?.destruct();
			window.editor = Jodit.make('#editor-area', {
				filebrowser: {
					ajax: {
						url: 'https://xdsoft.net/jodit/finder/'
					}
				}
			});
		});
	});

	if (!args.debug) {
		after(function () {
			console.log('Closing browser');
			browser.close();
			listen.close();
		});
	}

	require('./mock.request');
}
