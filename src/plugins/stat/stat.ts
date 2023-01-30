/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/stat/README.md]]
 * @packageDocumentation
 * @module plugins/stat
 */

import type { Nullable } from 'jodit/types';
import { INVISIBLE_SPACE_REG_EXP, SPACE_REG_EXP } from 'jodit/core/constants';
import { Plugin } from 'jodit/core/plugin/plugin';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { autobind, throttle } from 'jodit/core/decorators';

import './config';

/**
 * Show stat data - words and chars count
 */
export class stat extends Plugin {
	private __charCounter: Nullable<HTMLElement> = null;
	private __wordCounter: Nullable<HTMLElement> = null;

	@autobind
	private __reInit(): void {
		if (this.j.o.showCharsCounter && this.__charCounter) {
			this.j.statusbar.append(this.__charCounter, true);
		}

		if (this.j.o.showWordsCounter && this.__wordCounter) {
			this.j.statusbar.append(this.__wordCounter, true);
		}

		this.j.e
			.off('change keyup', this.__calc)
			.on('change keyup', this.__calc);

		this.__calc();
	}

	/** @override */
	afterInit(): void {
		this.__charCounter = this.j.c.span();
		this.__wordCounter = this.j.c.span();
		this.j.e.on('afterInit changePlace afterAddPlace', this.__reInit);
		this.__reInit();
	}

	@throttle()
	private __calc(): void {
		const text = this.j.text;

		if (this.j.o.showCharsCounter && this.__charCounter) {
			const chars = this.j.o.countHTMLChars
				? this.j.value
				: text.replace(SPACE_REG_EXP(), '');

			this.__charCounter.textContent = this.j.i18n(
				'Chars: %d',
				chars.length
			);
		}

		if (this.j.o.showWordsCounter && this.__wordCounter) {
			this.__wordCounter.textContent = this.j.i18n(
				'Words: %d',
				text
					.replace(INVISIBLE_SPACE_REG_EXP(), '')
					.split(SPACE_REG_EXP())
					.filter((e: string) => e.length).length
			);
		}
	}

	/** @override */
	beforeDestruct(): void {
		Dom.safeRemove(this.__charCounter);
		Dom.safeRemove(this.__wordCounter);

		this.j.e.off('afterInit changePlace afterAddPlace', this.__reInit);

		this.__charCounter = null;
		this.__wordCounter = null;
	}
}

pluginSystem.add('stat', stat);
