/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/stat
 */

import type { Nullable } from 'jodit/types';
import { Config } from 'jodit/config';
import { INVISIBLE_SPACE_REG_EXP, SPACE_REG_EXP } from 'jodit/core/constants';
import { Plugin } from 'jodit/core/plugin';
import { Dom } from 'jodit/core/dom';

declare module 'jodit/config' {
	interface Config {
		showCharsCounter: boolean;
		countHTMLChars: boolean;
		showWordsCounter: boolean;
	}
}

Config.prototype.showCharsCounter = true;
Config.prototype.countHTMLChars = false;
Config.prototype.showWordsCounter = true;

/**
 * Show stat data - words and chars count
 */
export class stat extends Plugin {
	private charCounter: Nullable<HTMLElement> = null;
	private wordCounter: Nullable<HTMLElement> = null;

	private reInit = (): void => {
		if (this.j.o.showCharsCounter && this.charCounter) {
			this.j.statusbar.append(this.charCounter, true);
		}

		if (this.j.o.showWordsCounter && this.wordCounter) {
			this.j.statusbar.append(this.wordCounter, true);
		}

		this.j.e.off('change keyup', this.calc).on('change keyup', this.calc);

		this.calc();
	};

	/** @override */
	afterInit(): void {
		this.charCounter = this.j.c.span();
		this.wordCounter = this.j.c.span();
		this.j.e.on('afterInit changePlace afterAddPlace', this.reInit);
		this.reInit();
	}

	private calc = this.j.async.throttle(() => {
		const text = this.j.text;

		if (this.j.o.showCharsCounter && this.charCounter) {
			const chars = this.j.o.countHTMLChars
				? this.j.value
				: text.replace(SPACE_REG_EXP(), '');

			this.charCounter.textContent = this.j.i18n(
				'Chars: %d',
				chars.length
			);
		}

		if (this.j.o.showWordsCounter && this.wordCounter) {
			this.wordCounter.textContent = this.j.i18n(
				'Words: %d',
				text
					.replace(INVISIBLE_SPACE_REG_EXP(), '')
					.split(SPACE_REG_EXP())
					.filter((e: string) => e.length).length
			);
		}
	}, this.j.defaultTimeout);

	/** @override */
	beforeDestruct(): void {
		Dom.safeRemove(this.charCounter);
		Dom.safeRemove(this.wordCounter);

		this.j.e.off('afterInit changePlace afterAddPlace', this.reInit);

		this.charCounter = null;
		this.wordCounter = null;
	}
}
