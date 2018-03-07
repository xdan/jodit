var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')
var compression = require('compression')
var app = new (require('express'))()

app.use(compression())

var port = 2000

var compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
    stats: { colors: true },
    noInfo: true,
    publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get("/test.html", function(req, res) {
    res.sendFile(__dirname + '/test.html')
})

app.get("/dist/jodit.*", function(req, res) {
    res.sendFile(__dirname + '/' + req.url)
})

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
