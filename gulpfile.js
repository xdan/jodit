const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');

const tsProject = ts.createProject('tsconfig.json', {
	target: "es2015",
});

const make = require('./make.js');
const entries = require('./src/utils/create-entries');
const rootPath = path.resolve(process.cwd()) + path.sep;
const mergeStream = require('merge-stream');
const files = entries.resolve(make.paths);

function typescript() {
	const tsFiles = entries.filter(files, (ext) => /^(ts|js)$/i.test(ext));

	const tasks = [];
	for (const file of tsFiles) {
		const full = path.dirname(path.resolve(file)).replace(rootPath, '');

		tasks.push(
			gulp
				.src(path.resolve(file))
				.pipe(tsProject())
				.js.pipe(gulp.dest('build/' + full))
		);
	}

	return mergeStream.apply(null, tasks);
}

function assets() {
	const tsFiles = entries.filter(files, (ext) => !['ts', 'js', 'less', 'css'].includes(ext));

	const tasks = [];

	for (const file of tsFiles) {
		const full = path.dirname(path.resolve(file)).replace(rootPath, '');
		let pipe = gulp.src(path.resolve(file));

		if (/\.(jpg|jpeg|png|svg|ico)$/i.test(file)) {
			pipe = pipe.pipe(imagemin());
		}

		tasks.push(
				pipe
					.pipe(gulp.dest('build/' + full))
		);
	}

	return mergeStream.apply(null, tasks);
};

function styles() {
	const tsFiles = entries.filter(files, (ext) => /^(less|css)$/i.test(ext));

	const tasks = [];

	for (const file of tsFiles) {
		const full = path.dirname(path.resolve(file)).replace(rootPath, '');

		tasks.push(
			gulp
				.src(path.resolve(file))
				.pipe(less())
				.pipe(gulp.dest('build/' + full))
		);
	}

	return mergeStream.apply(null, tasks);
};

exports.default = gulp.parallel(typescript, assets, styles);
