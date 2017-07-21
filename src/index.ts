import "./styles/jodit.less";
import * as consts from './constants';
import './polyfills';
import Toolbar from './modules/Toolbar'

module.exports = require('./Jodit').default;
import './Config'

for (let key in consts) {
    module.exports[key] = consts[key];
}
declare var require: any;

let requireAll = (r) => {
    r.keys().forEach(r);
}
requireAll(require.context('./plugins/', true, /\.ts$/));

requireAll(require.context('./styles/modules/', true, /\.less$/));
requireAll(require.context('./styles/widgets/', true, /\.less$/));
requireAll(require.context('./styles/plugins/', true, /\.less$/));

let context = require.context('./styles/icons/', true, /\.svg$/);

context.keys().forEach(function (key) {
    Toolbar.icons[key.replace('.svg', '').replace('./', '')] = context.apply(this, arguments)
        .replace(/(version|id)="[^"]+"/gm, '')
        .replace(/xmlns="http:\/\/www.w3.org\/2000\/svg"/gm, '')
        .replace(/xmlns:xlink="http:\/\/www.w3.org\/1999\/xlink"/gm, '')
        .replace(/<!--.*-->/gm, '');
});

let context2 = require.context('./modules/', true, /\.ts/);
context2.keys().forEach(function (key) {
    module.exports.modules[key.replace('.ts', '').replace('./', '')] = context2.apply(this, arguments).default;
});
requireAll(require.context('./langs/', true, /\.ts$/));
