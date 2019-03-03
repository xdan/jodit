/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import './styles/bundle.less';

declare function require(moduleName: string): any;

// for SSR
if (typeof window !== 'undefined') {
    require('./polyfills');
}

import { Jodit as DefaultJodit } from './Jodit';

import * as consts from './constants';
import * as Languages from './langs/index';
import * as Modules from './modules/index';
import * as Plugins from './plugins/index';
import * as Icons from './styles/icons/index';

import { Config, OptionsDefault } from './Config';
import { ToolbarIcon } from './modules/toolbar/icon';

// copy constants in Jodit
Object.keys(consts).forEach((key: string) => {
    (DefaultJodit as any)[key] = (consts as any)[key];
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
        DefaultJodit.modules[key] = (Modules as any)[key];
    });

['Confirm', 'Alert', 'Promt'].forEach((key: string) => {
    (DefaultJodit as any)[key] = (Modules as any)[key];
});

// Plugins
Object.keys(Plugins)
    .filter(esFilter)
    .forEach((key: string) => {
        DefaultJodit.plugins[key] = (Plugins as any)[key];
    });

// Languages
Object.keys(Languages)
    .filter(esFilter)
    .forEach((key: string) => {
        DefaultJodit.lang[key] = (Languages as any)[key];
    });

DefaultJodit.defaultOptions = Config.defaultOptions;
OptionsDefault.prototype = DefaultJodit.defaultOptions;

export const Jodit = DefaultJodit;
export default DefaultJodit;
