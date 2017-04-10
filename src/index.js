import "./styles/jodit.less";
import * as consts from './constants';
import './polyfills.js';
import Toolbar from './modules/Toolbar'

module.exports = require('./jodit').default;
require('./config');

for (let key in consts) {
    module.exports[key] = consts[key];
}

let requireAll = (r) => {
    r.keys().forEach(r);
}

requireAll(require.context('./plugins/', true, /\.js$/));
requireAll(require.context('./styles/modules/', true, /\.less$/));
requireAll(require.context('./styles/plugins/', true, /\.less$/));

let context = require.context('./styles/icons/', true, /\.svg$/);
context.keys().forEach(function (key) {
    Toolbar.icons[key.replace('.svg', '').replace('./', '')] = context.apply(this, arguments);
});

requireAll(require.context('./langs/', true, /\.js$/));
