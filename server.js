const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config');
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

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

app.get("/test.html", function(req, res) {
    res.sendFile(__dirname + '/test.html')
});

app.get("/build/jodit.*", function(req, res) {
    res.sendFile(__dirname + '/' + req.url)
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
