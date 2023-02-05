/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/spellcheck
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { Icon } from 'jodit/core/ui/icon';

declare module 'jodit/config' {
	interface Config {
		/**
		 * Options specifies whether the editor is to have its spelling and grammar checked or not
		 * @see http://www.w3schools.com/tags/att_global_spellcheck.asp
		 */
		spellcheck: boolean;
	}
}

Config.prototype.spellcheck = false;

Icon.set('spellcheck', require('./spellcheck.svg'));

Config.prototype.controls.spellcheck = {
	isActive(e: IJodit): boolean {
		return e.o.spellcheck;
	},
	icon: require('./spellcheck.svg'),
	name: 'spellcheck',
	command: 'toggleSpellcheck',
	tooltip: 'Spellcheck'
} as IControlType;
