/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import {
	COMMAND_KEYS,
	INVISIBLE_SPACE_REG_EXP,
	SPACE_REG_EXP
} from '../core/constants';
import { IJodit, SnapshotType } from '../types';
import { stripTags } from '../core/helpers';

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
 * @param jodit
 */
export function limit(jodit: IJodit) {
	if (jodit && (jodit.o.limitWords || jodit.o.limitChars)) {
		const callback = (
			event: KeyboardEvent | null,
			inputText: string = ''
		): void | boolean => {
			const text: string =
				inputText || (jodit.o.limitHTML ? jodit.value : jodit.text);

			const words: string[] = text
				.replace(INVISIBLE_SPACE_REG_EXP(), '')
				.split(SPACE_REG_EXP())
				.filter((e: string) => e.length);

			if (event && COMMAND_KEYS.includes(event.key)) {
				return;
			}

			if (jodit.o.limitWords && jodit.o.limitWords <= words.length) {
				return jodit.o.limitWords === words.length;
			}

			if (
				jodit.o.limitChars &&
				jodit.o.limitChars <= words.join('').length
			) {
				return jodit.o.limitChars === words.join('').length;
			}

			return;
		};

		let snapshot: SnapshotType | null = null;

		jodit.e
			.off('.limit')
			.on('beforePaste.limit', () => {
				snapshot = jodit.observer.snapshot.make();
			})
			.on(
				'keydown.limit keyup.limit beforeEnter.limit beforePaste.limit',
				(event: KeyboardEvent): false | void => {
					if (callback(event) !== undefined) {
						return false;
					}
				}
			)
			.on(
				'change.limit',
				jodit.async.debounce((newValue: string, oldValue: string) => {
					if (
						callback(
							null,
							jodit.o.limitHTML ? newValue : stripTags(newValue)
						) === false
					) {
						jodit.value = oldValue;
					}
				}, jodit.defaultTimeout)
			)
			.on('afterPaste.limit', (): false | void => {
				if (callback(null) === false && snapshot) {
					jodit.observer.snapshot.restore(snapshot);
					return false;
				}
			});
	}
}
