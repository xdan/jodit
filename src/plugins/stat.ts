/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import { INVISIBLE_SPACE_REG_EXP, SPACE_REG_EXP } from '../core/constants';
import { Plugin } from '../core/plugin';
import { Dom } from '../core/dom';

declare module '../config' {
	interface Config {
		showCharsCounter: boolean;
		showWordsCounter: boolean;
	}
}

Config.prototype.showCharsCounter = true;
Config.prototype.showWordsCounter = true;

/**
 * Show stat data - words and chars count
 */
export class stat extends Plugin {
	private charCounter!: HTMLElement;
	private wordCounter!: HTMLElement;

	private reInit = (): void => {
		if (this.j.o.showCharsCounter) {
			this.j.statusbar.append(this.charCounter, true);
		}

		if (this.j.o.showWordsCounter) {
			this.j.statusbar.append(this.wordCounter, true);
		}

		this.j.e.off('change keyup', this.calc).on('change keyup', this.calc);

		this.calc();
	};

	afterInit() {
		this.charCounter = this.j.c.span();
		this.wordCounter = this.j.c.span();
		this.j.e.on('afterInit changePlace afterAddPlace', this.reInit);
		this.reInit();
	}

	private calc = this.j.async.throttle(() => {
		const text = this.j.text;

		if (this.j.o.showCharsCounter) {
			this.charCounter.textContent = this.j.i18n(
				'Chars: %d',
				text.replace(SPACE_REG_EXP(), '').length
			);
		}

		if (this.j.o.showWordsCounter) {
			this.wordCounter.textContent = this.j.i18n(
				'Words: %d',
				text
					.replace(INVISIBLE_SPACE_REG_EXP(), '')
					.split(SPACE_REG_EXP())
					.filter((e: string) => e.length).length
			);
		}
	}, this.j.defaultTimeout);

	beforeDestruct(): void {
		Dom.safeRemove(this.charCounter);
		Dom.safeRemove(this.wordCounter);

		this.j.e.off('afterInit changePlace afterAddPlace', this.reInit);

		delete this.charCounter;
		delete this.wordCounter;
	}
}
