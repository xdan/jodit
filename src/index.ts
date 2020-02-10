/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './styles/bundle.less';

declare function require(moduleName: string): any;

if (process.env.TARGET_ES !== 'es2018' && typeof window !== 'undefined') {
	require('./polyfills');
}

import { Jodit as DefaultJodit } from './Jodit';

import Languages from './langs/index';

import * as consts from './constants';
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
		ToolbarIcon.setIcon(key.replace('_', '-'), (Icons as any)[key]);
	});

// Modules
Object.keys(Modules)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultJodit.modules[key] = (Modules as any)[key];
	});

['Confirm', 'Alert', 'Prompt'].forEach((key: string) => {
	(DefaultJodit as any)[key] = (Modules as any)[key];
});

// Plugins
Object.keys(Plugins)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultJodit.plugins.add(key, (Plugins as any)[key]);
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
