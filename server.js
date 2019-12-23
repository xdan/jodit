const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const fs = require('fs');
const gulptasks = require('./gulpfile');

const config = require('./webpack.config')([], {
	es: 'es5',
	isTest: true
});

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
    res.sendFile(__dirname + '/index.html')
});

app.get("/icons.html", (req, res) => {
	res.sendFile(__dirname + '/icons.html')
});

app.get("/test.html", (req, res) => {
    res.sendFile(__dirname + '/test.html')
});

app.get("/fake.html", (req, res) => {
    res.sendFile(__dirname + '/fake.html')
});

app.get("/build/*.*", (req, res) => {
	const filename = __dirname + '/' + req.url;

	if (fs.existsSync(filename)) {
		res.sendFile(filename)
	} else {
		res.status(404).send('Not Found');
	}
});

app.use('/node_modules', require('express').static(__dirname + '/node_modules'));

app.use('/test', require('express').static(__dirname + '/test'));
app.use('/app.css', require('express').static(__dirname + '/app.css'));
app.use('/examples/download.jpg', require('express').static(__dirname + '/examples/download.jpg'));

app.listen(port, function(error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
});
