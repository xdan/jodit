/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { INVISIBLE_SPACE_REG_EXP, SPACE_REG_EXP } from '../constants';
import { Plugin } from '../modules/Plugin';
import { Dom } from '../modules/Dom';

declare module '../Config' {
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
		if (this.jodit.options.showCharsCounter) {
			this.jodit.statusbar.append(this.charCounter, true);
		}

		if (this.jodit.options.showWordsCounter) {
			this.jodit.statusbar.append(this.wordCounter, true);
		}

		this.jodit.events
			.off('change keyup', this.calc)
			.on('change keyup', this.calc);

		this.calc();
	};

	afterInit() {
		this.charCounter = this.jodit.create.span();
		this.wordCounter = this.jodit.create.span();
		this.jodit.events.on('afterInit changePlace afterAddPlace', this.reInit);
		this.reInit();
	}

	private calc = this.jodit.async.throttle(() => {
		const text = this.jodit.text;

		if (this.jodit.options.showCharsCounter) {
			this.charCounter.textContent = this.jodit.i18n(
				'Chars: %d',
				text.replace(SPACE_REG_EXP, '').length
			);
		}

		if (this.jodit.options.showWordsCounter) {
			this.wordCounter.textContent = this.jodit.i18n(
				'Words: %d',
				text
					.replace(INVISIBLE_SPACE_REG_EXP, '')
					.split(SPACE_REG_EXP)
					.filter((e: string) => e.length).length
			);
		}
	}, this.jodit.defaultTimeout);

	beforeDestruct(): void {
		Dom.safeRemove(this.charCounter);
		Dom.safeRemove(this.wordCounter);

		this.jodit.events.off('afterInit changePlace afterAddPlace', this.reInit);

		delete this.charCounter;
		delete this.wordCounter;
	}
}
