/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/limit/README.md]]
 * @packageDocumentation
 * @module plugins/limit
 */

import type { IJodit, SnapshotType } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import {
	COMMAND_KEYS,
	INVISIBLE_SPACE_REG_EXP,
	SPACE_REG_EXP
} from 'jodit/core/constants';
import { autobind } from 'jodit/core/decorators';
import { pluginSystem } from 'jodit/core/global';

import './config';

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
					snapshot = jodit.history.snapshot.make();
				})
				.on(
					'keydown.limit keyup.limit beforeEnter.limit',
					this.checkPreventKeyPressOrPaste
				)
				.on('change.limit', this.checkPreventChanging)
				.on('afterPaste.limit', (): false | void => {
					if (this.__shouldDenyInput(true) && snapshot) {
						jodit.history.snapshot.restore(snapshot);
						jodit.e.fire('denyPaste.limit');
						return false;
					}
				});
		}
	}

	/**
	 * Action should be prevented
	 */
	private shouldPreventInsertHTML(event: KeyboardEvent): boolean {
		if (
			event &&
			(COMMAND_KEYS.includes(event.key) || event.ctrlKey || event.metaKey)
		) {
			return false;
		}

		return this.__shouldDenyInput(false);
	}

	private __shouldDenyInput(strict: boolean): boolean {
		const { jodit } = this;
		const { limitWords, limitChars } = jodit.o;
		const text = jodit.o.limitHTML ? jodit.value : jodit.text;

		const words = this.__splitWords(text);

		if (limitWords && isGt(words.length, limitWords, strict)) {
			jodit.e.fire('denyWords.limit limit.limit');
			return true;
		}

		const should = Boolean(
			limitChars && isGt(words.join('').length, limitChars, strict)
		);

		if (should) {
			jodit.e.fire('denyChars.limit limit.limit');
		}

		return should;
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
	private checkPreventChanging(newValue: string, oldValue: string): void {
		const { jodit } = this;

		if (this.__shouldDenyInput(true)) {
			jodit.value = oldValue;
		}
	}

	/**
	 * Split text on words without technical characters
	 */
	private __splitWords(text: string): string[] {
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

function isGt(a: number, b: number, strict: boolean): boolean {
	return strict ? a > b : a >= b;
}

pluginSystem.add('limit', limit);
