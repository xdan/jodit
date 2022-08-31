/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

process.argv.push('--no-open=true');
process.argv.push('--port=2003');

const expect = require('expect');
const { run, host, close } = require('../server');
const { toMatchImageSnapshot } = require('expect-mocha-image-snapshot');
const puppeteer = require('puppeteer');
expect.extend({ toMatchImageSnapshot });

let browser;

before(async function () {
	this.timeout(60000);
	await run;
	browser = await puppeteer.launch({
		// headless: false,
		args: ['--disable-web-security']
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
	close();
});

require('./mock.request');
