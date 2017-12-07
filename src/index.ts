/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import "./styles/jodit.less";
import * as consts from './constants';
import './polyfills';
import Toolbar from './modules/Toolbar'

let Jodit = require('./Jodit').default;

window['Jodit'] = Jodit;

import './Config'

Object.keys(consts).forEach((key) => {
    Jodit[key] = consts[key];
});

declare let require: any;

const requireAll = (r) => {
    r.keys().forEach(r);
};

requireAll(require.context('./styles/themes/', true, /\.less$/));
requireAll(require.context('./styles/modules/', true, /\.less$/));
requireAll(require.context('./styles/widgets/', true, /\.less$/));
requireAll(require.context('./styles/plugins/', true, /\.less$/));

const context = require.context('./styles/icons/', true, /\.svg$/);

context.keys().forEach(function (key) {
    Toolbar.icons[key.replace('.svg', '').replace('./', '')] = context.apply(this, arguments);
});

const context2 = require.context('./modules/', true, /\.ts/);
context2.keys().forEach(function (key) {
    var module = context2.apply(this, arguments);
    Jodit.modules[key.replace('.ts', '').replace('./', '')] = module.default || module;
});

const plugins = require.context('./plugins/', true, /\.ts/);
plugins.keys().forEach(function (key) {
    var plugin = plugins.apply(this, arguments);
    Jodit.plugins[key.replace('.ts', '').replace('./', '')] = plugin.default || plugin;
});


const context3 = require.context('./langs/', true, /\.ts$/);
context3.keys().forEach(function (key) {
    Jodit.lang[key.replace('.ts', '').replace('./', '')] = context3.apply(this, arguments).default;
});


module.exports = Jodit;