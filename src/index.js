import "./styles/jodit.less";
import * as consts from './constants';
import './polyfills.js';

module.exports = require('./jodit').default;
require('./config');

for (let key in consts) {
    module.exports[key] = consts[key];
}

let requireAll = (r) => {
    r.keys().forEach(r);
}

requireAll(require.context('./plugins/', true, /\.js$/));
requireAll(require.context('./langs/', true, /\.js$/));
