import '../src/index';
import './bootstrap.js'

/// <reference path="./webpack.d.ts" />
/// <reference path="./webpack-env.d.ts" />

declare var require: any;

var testsContext = require.context(".", true, /_test$/);
testsContext.keys().forEach(testsContext);