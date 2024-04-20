/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import expect from 'expect';
// @ts-ignore
import toMatchImageSnapshot from 'expect-mocha-image-snapshot';
import express from 'express';
import fs from 'fs';
import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';
import yargs from 'yargs';

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
	.parse();

if (!args.build) {
	throw new Error('Build type is not defined');
}

console.info('Build:', args.build);
console.info('Debug:', args.debug);
console.info('Fat:', args.fat);
console.info('Min:', args.min);

const app = express();

expect.extend({ toMatchImageSnapshot });

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

const listen = app.listen(port, host, () => {
	console.info(`Server started on ${host}`);
});

let browser: Browser;
let page: Page;

if (typeof before !== 'undefined') {
	before(async function () {
		this.timeout(10_000);
		browser = await puppeteer.launch({
			headless: args.debug ? false : 'new',
			executablePath: '/usr/bin/google-chrome-stable',
			args: [
				'--disable-dev-shm-usage',
				'--disable-gpu',
				'--disable-web-security',
				'--no-sandbox',
				'--disable-setuid-sandbo'
			]
		});

		page = await browser.newPage();
		await page.setViewport({ width: 1200, height: 800 });
		await page.goto(host, { waitUntil: 'networkidle2' });
	});

	beforeEach(async function () {
		this.timeout(10_000);
		await page.reload({ waitUntil: 'networkidle2' });
		await page.evaluate(() => {
			// @ts-ignore
			window.editor?.destruct();
			// @ts-ignore
			window.editor = Jodit.make('#editor-area', {
				aiAssistant: {
					aiAssistantCallback: async (text: string, html: string) => {
						return `AI: ${text} HTML: ${html} answer`;
					}
				},
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
			// eslint-disable-next-line no-console
			console.log('Closing browser');
			browser.close();
			listen.close();
		});
	}

	require('./mock.request');
}

export { browser, expect, page };
