const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

const gulptasks = require(path.resolve(cwd, './gulpfile'));

const config = require(path.resolve(cwd, './webpack.config'))([], {
	es: 'es5',
	isTest: true
}, cwd);

gulptasks.watch();

const compression = require('compression');
const app = new (require('express'))();

app.use(compression());

const port = 2000;

const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
    stats: { colors: true },
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

app.get("/", (req, res) => {
    res.sendFile(cwd + '/index.html')
});

app.get("/icons.html", (req, res) => {
	res.sendFile(cwd + '/icons.html')
});

app.get("/test.html", (req, res) => {
    res.sendFile(cwd + '/test.html')
});

app.get("/fake.html", (req, res) => {
    res.sendFile(cwd + '/fake.html')
});

app.get("/build/*.*", (req, res) => {
	const filename = cwd + '/' + req.url;

	if (fs.existsSync(filename)) {
		res.sendFile(filename)
	} else {
		res.status(404).send('Not Found');
	}
});

app.use('/node_modules', require('express').static(cwd + '/node_modules'));

app.use('/test', require('express').static(cwd + '/test'));
app.use('/app.css', require('express').static(cwd + '/app.css'));
app.use('/examples/download.jpg', require('express').static(cwd + '/examples/download.jpg'));

app.listen(port, function(error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
});
