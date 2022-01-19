/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/limit
 */

import type { IJodit, SnapshotType } from 'jodit/types';
import { Config } from 'jodit/config';
import { Plugin } from 'jodit/core/plugin';
import {
	COMMAND_KEYS,
	INVISIBLE_SPACE_REG_EXP,
	SPACE_REG_EXP
} from 'jodit/core/constants';
import { stripTags } from 'jodit/core/helpers';
import { autobind } from 'jodit/core/decorators';

declare module 'jodit/config' {
	interface Config {
		/**
		 * limit words count
		 */
		limitWords: false | number;

		/**
		 * limit chars count
		 */
		limitChars: false | number;

		/**
		 * limit html chars count
		 */
		limitHTML: false;
	}
}

Config.prototype.limitWords = false;
Config.prototype.limitChars = false;
Config.prototype.limitHTML = false;

/**
 * Plugin control for chars or words count
 */
export class limit extends Plugin {
	/** @override **/
	protected afterInit(jodit: IJodit): void {
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
	 */
	@autobind
	private checkPreventKeyPressOrPaste(event: KeyboardEvent): void | false {
		if (this.shouldPreventInsertHTML(event)) {
			return false;
		}
	}

	/**
	 * Check if some external changing should be prevented
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
	 */
	private splitWords(text: string): string[] {
		return text
			.replace(INVISIBLE_SPACE_REG_EXP(), '')
			.split(SPACE_REG_EXP())
			.filter(e => e.length);
	}

	/** @override **/
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off('.limit');
	}
}
