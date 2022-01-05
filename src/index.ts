/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:README.md]]
 * @packageDocumentation
 * @module jodit
 */

import './styles';

declare function require(moduleName: string): any;

if (process.env.TARGET_ES !== 'es2018' && typeof window !== 'undefined') {
	require('./polyfills');
}

import { Jodit as DefaultJodit } from './jodit';

import Languages from './langs/';

import * as decorators from './core/decorators';
import * as consts from './core/constants';
import * as Modules from './modules/';
import * as Plugins from './plugins/';
import * as Icons from './styles/icons/';

// copy constants in Jodit
Object.keys(consts).forEach((key: string) => {
	(DefaultJodit as any)[key] = (consts as any)[key];
});

const esFilter = (key: string): boolean => key !== '__esModule';

// Icons
Object.keys(Icons)
	.filter(esFilter)
	.forEach((key: string) => {
		Modules.Icon.set(key.replace('_', '-'), (Icons as any)[key]);
	});

// Modules
Object.keys(Modules)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultJodit.modules[key] = (Modules as any)[key];
	});

// Decorators
Object.keys(decorators)
	.filter(esFilter)
	.forEach((key: string) => {
		DefaultJodit.decorators[key] = (decorators as any)[key];
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

export { DefaultJodit as Jodit };
