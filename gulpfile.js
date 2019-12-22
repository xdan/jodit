const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const less = require('gulp-less');
const imagemin = require('gulp-imagemin');

const tsProject = ts.createProject('tsconfig.json', {
	target: 'es5',
	module: 'es2015'
});

const make = require('./make.js');
const entries = require('./src/utils/create-entries');
const rootPath = path.resolve(process.cwd()) + path.sep;
const mergeStream = require('merge-stream');
const files = entries.resolve(make.paths);

exports.build = function build() {
	const tasks = [];
	for (const file of files) {
		const full = path.dirname(path.resolve(file)).replace(rootPath, '');
		let pipe = gulp.src(path.resolve(file));

		const ext = path.extname(path.resolve(file)).toLowerCase();

		switch (ext) {
			case '.ts':
				pipe = pipe.pipe(tsProject()).js;
				break;

			case '.less':
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

		tasks.push(pipe.pipe(gulp.dest('build/' + full)));
	}

	return mergeStream.apply(null, tasks);
};

exports.watch = function watch () {
	gulp.watch(files, gulp.series('build'));
};

exports.default = () => gulp.series('watch');
