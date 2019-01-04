/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import './styles/bundle.less';

declare function require(moduleName: string): any;

// for SSR
if (typeof window !== 'undefined') {
    require('./polyfills');
}

import { Jodit } from './Jodit';

import * as consts from './constants';
import * as Languages from './langs/index';
import * as Modules from './modules/index';
import * as Plugins from './plugins/index';
import * as Icons from './styles/icons/index';

import { Config, OptionsDefault } from './Config';
import { ToolbarIcon } from './modules/toolbar/icon';

// copy constants in Jodit
Object.keys(consts).forEach((key: string) => {
    (Jodit as any)[key] = (consts as any)[key];
});

const esFilter = (key: string): boolean => key !== '__esModule';

// Icons
Object.keys(Icons)
    .filter(esFilter)
    .forEach((key: string) => {
        ToolbarIcon.icons[key.replace('_', '-')] = (Icons as any)[key];
    });

// Modules
Object.keys(Modules)
    .filter(esFilter)
    .forEach((key: string) => {
        Jodit.modules[key] = (Modules as any)[key];
    });

['Confirm', 'Alert', 'Promt'].forEach((key: string) => {
    (Jodit as any)[key] = (Modules as any)[key];
});

// Plugins
Object.keys(Plugins)
    .filter(esFilter)
    .forEach((key: string) => {
        Jodit.plugins[key] = (Plugins as any)[key];
    });

// Languages
Object.keys(Languages)
    .filter(esFilter)
    .forEach((key: string) => {
        Jodit.lang[key] = (Languages as any)[key];
    });

Jodit.defaultOptions = Config.defaultOptions;
OptionsDefault.prototype = Jodit.defaultOptions;

export = Jodit;
