/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import { Config } from '../Config';
import {
	COMMAND_KEYS,
	INVISIBLE_SPACE_REG_EXP,
	SPACE_REG_EXP
} from '../constants';
import { debounce } from '../modules/helpers/async';
import { IJodit, SnapshotType } from '../types';
import { stripTags } from '../modules/helpers/html';

declare module '../Config' {
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
	if (jodit && (jodit.options.limitWords || jodit.options.limitChars)) {
		const callback = (
			event: KeyboardEvent | null,
			inputText: string = ''
		): void | boolean => {
			const text: string =
				inputText ||
				(jodit.options.limitHTML ? jodit.value : jodit.getEditorText());

			const words: string[] = text
				.replace(INVISIBLE_SPACE_REG_EXP, '')
				.split(SPACE_REG_EXP)
				.filter((e: string) => e.length);

			if (event && COMMAND_KEYS.indexOf(event.which) !== -1) {
				return;
			}

			if (
				jodit.options.limitWords &&
				jodit.options.limitWords <= words.length
			) {
				return jodit.options.limitWords === words.length;
			}

			if (
				jodit.options.limitChars &&
				jodit.options.limitChars <= words.join('').length
			) {
				return jodit.options.limitChars === words.join('').length;
			}

			return;
		};

		let snapshot: SnapshotType | null = null;

		jodit.events
			.on(
				'beforePaste',
				() => {
					snapshot = jodit.observer.snapshot.make();
				}
			)
			.on(
				'keydown keyup beforeEnter beforePaste',
				(event: KeyboardEvent): false | void => {
					if (callback(event) !== undefined) {
						return false;
					}
				}
			)
			.on(
				'change',
				debounce((newValue: string, oldValue: string) => {
					if (
						callback(
							null,
							jodit.options.limitHTML
								? newValue
								: stripTags(newValue)
						) === false
					) {
						jodit.value = oldValue;
					}
				}, jodit.defaultTimeout)
			)
			.on(
				'afterPaste',
				(): false | void => {
					if (callback(null) === false && snapshot) {
						jodit.observer.snapshot.restore(snapshot);
						return false;
					}
				}
			);
	}
}
