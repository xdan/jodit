/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

let build = '';
process.argv.forEach(arg => {
	if (/--build=/.test(arg)) {
		build = arg.replace('--build=', '');
	}
});

console.info('Build:', build || 'usual');

const fs = require('fs');
const expect = require('expect');
const path = require('path');
const { toMatchImageSnapshot } = require('expect-mocha-image-snapshot');
const puppeteer = require('puppeteer');
const express = require('express');
const app = new express();

expect.extend({ toMatchImageSnapshot });

const port = 2003;
const host = `http://localhost:${port}`;

app.get('/', (req, res) => {
	res.send(
		fs
			.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
			.replace(/\/jodit\./g, `/jodit.${build ? build + '.' : ''}`)
	);
});

app.use('/', express.static(__dirname));
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
			// headless: false,
			args: ['--disable-web-security', '--no-sandbox']
		});

		global.page = await browser.newPage();
		await global.page.setViewport({ width: 1200, height: 800 });
		await global.page.goto(host, { waitUntil: 'networkidle2' });
	});

	beforeEach(async function () {
		await global.page.reload({ waitUntil: 'networkidle2' });
	});

	after(function () {
		console.log('Closing browser');
		browser.close();
		listen.close();
	});

	require('./mock.request');
}
