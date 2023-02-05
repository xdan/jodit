/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/spellcheck/README.md]]
 * @packageDocumentation
 * @module plugins/spellcheck
 */

import type { IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { attr } from 'jodit/core/helpers/utils/utils';
import { autobind } from 'jodit/core/decorators';
import { extendLang, pluginSystem } from 'jodit/core/global';

import './config';

export class spellcheck extends Plugin {
	override buttons: Plugin['buttons'] = [
		{
			group: 'state',
			name: 'spellcheck'
		}
	];

	constructor(jodit: IJodit) {
		super(jodit);
		extendLang(require('./langs'));
	}

	protected afterInit(jodit: IJodit): void {
		jodit.e.on(
			'afterInit afterAddPlace prepareWYSIWYGEditor',
			this.toggleSpellcheck
		);
		this.toggleSpellcheck();

		jodit.registerCommand('toggleSpellcheck', () => {
			this.jodit.o.spellcheck = !this.jodit.o.spellcheck;
			this.toggleSpellcheck();
			this.j.e.fire('updateToolbar');
		});
	}

	@autobind
	private toggleSpellcheck(): void {
		attr(this.jodit.editor, 'spellcheck', this.jodit.o.spellcheck);
	}

	protected beforeDestruct(jodit: IJodit): void {}
}

pluginSystem.add('spellcheck', spellcheck);
