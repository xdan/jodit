/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary, IJodit } from '../../types';
import { Config } from '../../config';
import { Plugin } from '../../core/plugin';
import {
	isArray,
	isString,
	keys,
	normalizeKeyAliases
} from '../../core/helpers';
import { KEY_ESC } from '../../core/constants';

declare module '../../config' {
	interface Config {
		commandToHotkeys: IDictionary<string | string[]>;
	}
}

/**
 * You can redefine hotkeys for some command
 *
 * @example
 * var jodit = new Jodit('#editor', {
 *  commandToHotkeys: {
 *      bold: 'ctrl+shift+b',
 *      italic: ['ctrl+i', 'ctrl+b'],
 *  }
 * })
 */
Config.prototype.commandToHotkeys = {
	removeFormat: ['ctrl+shift+m', 'cmd+shift+m'],
	insertOrderedList: ['ctrl+shift+7', 'cmd+shift+7'],
	insertUnorderedList: ['ctrl+shift+8, cmd+shift+8'],
	selectall: ['ctrl+a', 'cmd+a']
};

/**
 * Allow set hotkey for command or button
 */
export class hotkeys extends Plugin {
	private onKeyPress = (event: KeyboardEvent): string => {
		const special: string | false = this.specialKeys[event.which],
			character: string = (
				event.key || String.fromCharCode(event.which)
			).toLowerCase();

		const modif: string[] = [special || character];

		['alt', 'ctrl', 'shift', 'meta'].forEach(specialKey => {
			if ((event as any)[specialKey + 'Key'] && special !== specialKey) {
				modif.push(specialKey);
			}
		});

		return normalizeKeyAliases(modif.join('+'));
	};

	specialKeys: { [key: number]: string } = {
		8: 'backspace',
		9: 'tab',
		10: 'return',
		13: 'return',
		16: 'shift',
		17: 'ctrl',
		18: 'alt',
		19: 'pause',
		20: 'capslock',
		27: 'esc',
		32: 'space',
		33: 'pageup',
		34: 'pagedown',
		35: 'end',
		36: 'home',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down',
		45: 'insert',
		46: 'del',
		59: ';',
		61: '=',
		91: 'meta',
		96: '0',
		97: '1',
		98: '2',
		99: '3',
		100: '4',
		101: '5',
		102: '6',
		103: '7',
		104: '8',
		105: '9',
		106: '*',
		107: '+',
		109: '-',
		110: '.',
		111: '/',
		112: 'f1',
		113: 'f2',
		114: 'f3',
		115: 'f4',
		116: 'f5',
		117: 'f6',
		118: 'f7',
		119: 'f8',
		120: 'f9',
		121: 'f10',
		122: 'f11',
		123: 'f12',
		144: 'numlock',
		145: 'scroll',
		173: '-',
		186: ';',
		187: '=',
		188: ',',
		189: '-',
		190: '.',
		191: '/',
		192: '`',
		219: '[',
		220: '\\',
		221: ']',
		222: "'"
	};

	/** @override */
	afterInit(editor: IJodit): void {
		keys(editor.o.commandToHotkeys, false).forEach(
			(commandName: string) => {
				const shortcuts = editor.o.commandToHotkeys[commandName];

				if (shortcuts && (isArray(shortcuts) || isString(shortcuts))) {
					editor.registerHotkeyToCommand(shortcuts, commandName);
				}
			}
		);

		let itIsHotkey: boolean = false;

		editor.e
			.off('.hotkeys')
			.on(
				[editor.ow, editor.ew],
				'keydown.hotkeys',
				(e: KeyboardEvent): void => {
					if (e.key === KEY_ESC) {
						return this.j.e.fire('escape', e);
					}
				}
			)
			.on(
				'keydown.hotkeys',
				(event: KeyboardEvent): void | false => {
					const shortcut: string = this.onKeyPress(event),
						stop = {
							shouldStop: true
						};

					const resultOfFire = this.j.e.fire(
						shortcut + '.hotkey',
						event.type,
						stop
					);

					if (resultOfFire === false) {
						if (stop.shouldStop) {
							itIsHotkey = true;
							editor.e.stopPropagation('keydown');
							return false;
						} else {
							event.preventDefault();
						}
					}
				},
				undefined,
				true
			)
			.on(
				'keyup.hotkeys',
				(): void | false => {
					if (itIsHotkey) {
						itIsHotkey = false;
						editor.e.stopPropagation('keyup');
						return false;
					}
				},
				undefined,
				true
			);
	}

	/** @override */
	beforeDestruct(jodit: IJodit): void {
		if (jodit.events) {
			jodit.e.off('.hotkeys');
		}
	}
}
