/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/spellcheck
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import spellcheckIcon from './spellcheck.svg';

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

Icon.set('spellcheck', spellcheckIcon);

Config.prototype.controls.spellcheck = {
	isActive(e: IJodit): boolean {
		return e.o.spellcheck;
	},
	icon: spellcheckIcon,
	name: 'spellcheck',
	command: 'toggleSpellcheck',
	tooltip: 'Spellcheck'
} as IControlType;
