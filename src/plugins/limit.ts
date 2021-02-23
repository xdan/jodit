/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, SnapshotType } from '../types';
import { Config } from '../config';
import { Plugin } from '../core/plugin';
import {
	COMMAND_KEYS,
	INVISIBLE_SPACE_REG_EXP,
	SPACE_REG_EXP
} from '../core/constants';
import { stripTags } from '../core/helpers';
import { autobind } from '../core/decorators';

declare module '../config' {
	interface Config {
		limitWords: false | number;
		limitChars: false | number;
		limitHTML: false;
	}
}

/**
 * @property {boolean | number} limitWords=false limit words count
 */
Config.prototype.limitWords = false;

/**
 * @property {boolean | number} limitChars=false limit chars count
 */
Config.prototype.limitChars = false;

/**
 * @property {boolean} limitHTML=false limit html chars count
 */
Config.prototype.limitHTML = false;

/**
 * Plugin control for chars or words count
 */
export class limit extends Plugin {
	/** @override **/
	protected afterInit(jodit: IJodit) {
		const { limitWords, limitChars } = jodit.o;

		if (jodit && (limitWords || limitChars)) {
			let snapshot: SnapshotType | null = null;

			jodit.e
				.off('.limit')
				.on('beforePaste.limit', () => {
					snapshot = jodit.observer.snapshot.make();
				})
				.on(
					'keydown.limit keyup.limit beforeEnter.limit beforePaste.limit',
					this.checkPreventKeyPressOrPaste
				)
				.on('change.limit', this.checkPreventChanging)
				.on('afterPaste.limit', (): false | void => {
					if (this.shouldPreventInsertHTML() && snapshot) {
						jodit.observer.snapshot.restore(snapshot);
						return false;
					}
				});
		}
	}

	/**
	 * Action should be prevented
	 *
	 * @param event
	 * @param inputText
	 */
	private shouldPreventInsertHTML(
		event: KeyboardEvent | null = null,
		inputText: string = ''
	): boolean {
		if (event && COMMAND_KEYS.includes(event.key)) {
			return false;
		}

		const { jodit } = this;
		const { limitWords, limitChars } = jodit.o;
		const text =
			inputText || (jodit.o.limitHTML ? jodit.value : jodit.text);

		const words = this.splitWords(text);

		if (limitWords && words.length >= limitWords) {
			return true;
		}

		return Boolean(limitChars) && words.join('').length >= limitChars;
	}

	/**
	 * Check if some keypress or paste should be prevented
	 * @param event
	 * @private
	 */
	@autobind
	private checkPreventKeyPressOrPaste(event: KeyboardEvent): void | false {
		if (this.shouldPreventInsertHTML(event)) {
			return false;
		}
	}

	/**
	 * Check if some external changing should be prevented
	 * @param newValue
	 * @param oldValue
	 */
	@autobind
	private checkPreventChanging(newValue: string, oldValue: string) {
		const { jodit } = this;
		const { limitWords, limitChars } = jodit.o;

		const text = jodit.o.limitHTML ? newValue : stripTags(newValue),
			words = this.splitWords(text);

		if (
			(limitWords && words.length > limitWords) ||
			(Boolean(limitChars) && words.join('').length > limitChars)
		) {
			jodit.value = oldValue;
		}
	}

	/**
	 * Split text on words without technical characters
	 * @param text
	 * @private
	 */
	private splitWords(text: string): string[] {
		return text
			.replace(INVISIBLE_SPACE_REG_EXP(), '')
			.split(SPACE_REG_EXP())
			.filter(e => e.length);
	}

	/** @override **/
	protected beforeDestruct(jodit: IJodit) {
		jodit.e.off('.limit');
	}
}
