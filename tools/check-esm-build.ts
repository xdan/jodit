/**
 * Check that all plugins are included in the ESM build
 */

import '../build/esm/plugins/all';

import { Jodit } from '../build/esm/index';

if (typeof Jodit === 'undefined') {
	throw new Error('Jodit not found');
}

if (typeof Jodit.plugins === 'undefined') {
	throw new Error('Jodit.plugins not found');
}

if (typeof Jodit.defaultOptions.controls.ol === 'undefined') {
	throw new Error('Jodit.defaultOptions.controls.ol not found');
}

if (Jodit.plugins.size !== Number(process.env.PLUGINS_COUNT)) {
	throw new Error(
		`Jodit.plugins.size: ${Jodit.plugins.size} Check PLUGINS_COUNT(${process.env.PLUGINS_COUNT}) in .env`
	);
}
