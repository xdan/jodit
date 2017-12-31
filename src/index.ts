/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import "./styles/bundle.less";
import './polyfills';

import {Toolbar}          from './modules/Toolbar';
import {Jodit}            from './Jodit';


import * as consts      from './constants';
import * as Plugins     from "./plugins/";
import * as Modules     from "./modules/";
import * as Languages   from "./langs/";
import * as Icons       from "./styles/icons/";

import {Config}         from "./Config";

// copy constants in Jodit
Object.keys(consts).forEach((key) => {
    Jodit[key] = consts[key];
});

const esFilter = (key: string): boolean => key !== '__esModule';

// Icons
Object.keys(Icons).filter(esFilter).forEach((key: string) => {
    Toolbar.icons[key.replace('_', '-')] = Icons[key];
});
// Modules
Object.keys(Modules).filter(esFilter).forEach((key: string) => {
    Jodit.modules[key] = Modules[key];
});

//Plugins
Object.keys(Plugins).filter(esFilter).forEach((key: string) => {
    Jodit.plugins[key] = Plugins[key];
});

// Languages
Object.keys(Languages).filter(esFilter).forEach((key: string) => {
    Jodit.lang[key] = Languages[key];
});

Jodit.defaultOptions = new Config();

export = Jodit;