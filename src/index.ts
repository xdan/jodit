/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import "./styles/bundle.less";
import './polyfills';

import {Jodit}            from './Jodit';
import {Toolbar}          from './modules/Toolbar';


import * as consts      from './constants';
import * as Plugins     from "./plugins/index";
import * as Modules     from "./modules/index";
import * as Languages   from "./langs/index";
import * as Icons       from "./styles/icons/index";

import {Config}         from "./Config";

// copy constants in Jodit
Object.keys(consts).forEach((key: string) => {
    (<any>Jodit)[key] = (<any>consts)[key];
});

const esFilter = (key: string): boolean => key !== '__esModule';

// Icons
Object.keys(Icons).filter(esFilter).forEach((key: string) => {
    Toolbar.icons[key.replace('_', '-')] = (<any>Icons)[key];
});
// Modules
Object.keys(Modules).filter(esFilter).forEach((key: string) => {
    Jodit.modules[key] = (<any>Modules)[key];
});

//Plugins
Object.keys(Plugins).filter(esFilter).forEach((key: string) => {
    Jodit.plugins[key] = (<any>Plugins)[key];
});

// Languages
Object.keys(Languages).filter(esFilter).forEach((key: string) => {
    Jodit.lang[key] = (<any>Languages)[key];
});

Jodit.defaultOptions = new Config();

export = Jodit;