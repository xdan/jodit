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

function buildOneFile(file) {
	console.log('Build file: ' + file);

	const full = path.dirname(path.resolve(file)).replace(rootPath, '');

	let pipe = gulp.src(path.resolve(file)).on('error', error => {
		console.warn(error);
	});

	const ext = path.extname(path.resolve(file)).toLowerCase();

	switch (ext) {
		case '.ts':
			pipe = pipe.pipe(tsProject(ts.reporter.defaultReporter())).js;
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

	return pipe.pipe(gulp.dest('build/' + full));
}

function build() {
	if (!files.length) {
		return gulp.src('.');
	}

	return mergeStream.apply(null, files.map(file => buildOneFile(file)));
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
