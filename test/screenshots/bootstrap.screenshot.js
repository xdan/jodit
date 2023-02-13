/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const args = {
	build: '',
	debug: false
};

process.argv.forEach(arg => {
	const res = /--(build|debug)=/.exec(arg);
	if (res) {
		const value = arg.split('=')[1];
		args[res[1]] = /(true|false)/.test(value) ? value === 'true' : value;
	}
});

console.info('Build:', args.build || 'es5');
console.info('Debug:', args.debug);

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
			.replace(
				/\/jodit\./g,
				`/jodit.${args.build ? args.build + '.' : ''}`
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
			headless: !args.debug,
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
