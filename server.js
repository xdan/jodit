/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

const reg = /--([a-zA-Z-]+)\s*=\s*(.*)/;
const args = {};

process.argv
	.filter(a => reg.test(a))
	.forEach(c => {
		const res = reg.exec(c);
		args[res[1]] = res[2];

		if (args[res[1]] === 'true') {
			args[res[1]] = true;
		}

		if (args[res[1]] === 'false') {
			args[res[1]] = false;
		}
	});

const config = require(path.resolve(cwd, './webpack.config'))(
	[],
	{
		es: 'es5',
		isTest: true,
		...args
	},
	cwd
);

const compression = require('compression');
const open = require('open');
const app = new express();

app.use(compression());

const port = args.port || 2000;

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler));

app.use(webpackHotMiddleware(compiler));

const compile = new Promise((resolve, reject) => {
	compiler.hooks.failed.tap('CompilePlugin', () => {
		reject();
	});

	compiler.hooks.done.tap('CompilePlugin', () => {
		resolve();
	});
});

app.get('/', (req, res) => {
	if (fs.existsSync(cwd + '/test.html')) {
		res.sendFile(cwd + '/test.html');
	} else {
		res.sendFile(cwd + '/index.html');
	}
});

app.get('/*.js', (req, res) => {
	res.sendFile(cwd + '/' + req.url);
});

app.get('/icons.html', (req, res) => {
	res.sendFile(cwd + '/icons.html');
});

app.get('/test.html', (req, res) => {
	res.sendFile(cwd + '/test.html');
});

app.get('/fake.html', (req, res) => {
	res.sendFile(cwd + '/fake.html');
});

app.use(express.static('./'));

app.get('/build/*.*', (req, res) => {
	const filename = cwd + '/' + req.url;

	if (fs.existsSync(filename)) {
		res.sendFile(filename);
	} else {
		res.status(404).send('Not Found');
	}
});

app.use('/node_modules', require('express').static(cwd + '/node_modules'));

app.use('/test', require('express').static(cwd + '/test'));
app.use('/app.css', require('express').static(cwd + '/app.css'));
app.use(
	'/examples/download.jpg',
	require('express').static(cwd + '/examples/download.jpg')
);

const host = `http://localhost:${port}/`;

let resolveServer;
const run = new Promise(resolve => {
	resolveServer = resolve;
});

const listen = app.listen(port, error => {
	if (error) {
		console.error(error);
		reject(error);
	} else {
		console.info(
			'==> Listening on port %s. Open up http://localhost:%s/ in your browser.',
			port,
			port
		);

		compile
			.then(() => resolveServer())
			.then(() => {
				if (!args['no-open']) {
					const open = require('open');
					open(host, {
						newInstance: false
					});
				}
			})
			.then(() => console.log('Build done'));
	}
});

module.exports = {
	host,
	port,
	run,
	close: () => {
		listen.close();
		compiler.close(() => {});
	}
};
