/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');
const rootPath = path.resolve(process.cwd()) + path.sep;

const make = require(path.resolve(rootPath, './make.js'));
const entries = require('./src/utils/create-entries');
const mergeStream = require('merge-stream');
const files = entries.resolve(make.paths);

function buildOneFile(file, list) {
	console.log('Build file: ' + file);

	file = path.resolve(file);
	const full = path.dirname(file).replace(rootPath, '');
	const ext = path.extname(file).toLowerCase();
	const filename = path.basename(file, ext);

	let pipe = gulp.src(file).on('error', error => {
		console.warn(error);
	});

	switch (ext) {
		case '.ts': {
			const opt = require(path.resolve(rootPath, './webpack.config.js'))([], {
				mode: 'production',
				isTest: false,
				uglify: true,
				es: 'es5'
			}, process.cwd(), true);

			pipe = pipe.pipe(
				webpack({
					...opt,
					entry: file,
					output: {
						filename: filename + '.js'
					},
				})
			);

			break;
		}

		case '.less':
			console.log(file, ext);

			pipe = pipe.pipe(less());
			break;

		case '.ico':
		case '.svg':
		case '.png':
		case '.jpg':
		case '.jpeg':
			pipe = pipe.pipe(imagemin());
			break;

		default:
			break;
	}

	return pipe.pipe(gulp.dest('build/' + full));
}

function build() {
	if (!files.length) {
		return gulp.src('.');
	}

	const list = [...files];
	let pipes = [];

	while (list.length) {
		const file = list.shift();
		file && pipes.push(buildOneFile(file, list));
	}

	return mergeStream.apply(null, pipes);
}

exports.watch = function watch() {
	if (!files.length) {
		return gulp.src('.');
	}

	files.forEach(file => {
		gulp.watch(
			file,
			{ ignoreInitial: false },
			buildOneFile.bind(null, file)
		);
	});
};

exports.default = () => gulp.parallel('watch');
exports.build = build;
