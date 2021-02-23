/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IJodit } from '../../types';
import { Plugin } from '../../core/plugin';
import { Config } from '../../config';
import { Dom } from '../../core/dom';
import { memorizeExec } from '../../core/helpers';

Config.prototype.controls.classSpan = {
	command: 'applyClassName',

	icon: require('./icon.svg'),

	exec: memorizeExec,

	list: [
		'enabled',
		'disabled',
		'activated',
		'text-left',
		'text-center',
		'text-right',
		'warning',
		'error'
	],

	isChildActive: (editor: IJodit, control: IControlType): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBpx: HTMLElement =
				(Dom.closest(
					current,
					elm => {
						return (
							Dom.isBlock(elm, editor.ew) ||
							(elm && Dom.isElement(elm))
						);
					},
					editor.editor
				) as HTMLElement) || editor.editor;

			return Boolean(
				control.args &&
					currentBpx.classList.contains(control.args[0].toString())
			);
		}

		return false;
	},

	isActive: (editor: IJodit, control: IControlType): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBpx: HTMLElement =
				(Dom.closest(
					current,
					elm => {
						return (
							Dom.isBlock(elm, editor.ew) ||
							(elm && Dom.isElement(elm))
						);
					},
					editor.editor
				) as HTMLElement) || editor.editor;

			let present: boolean = false;

			control.list &&
				Object.keys(control.list).forEach((className: string) => {
					if (currentBpx.classList.contains(className)) {
						present = true;
					}
				});

			return Boolean(
				currentBpx &&
					currentBpx !== editor.editor &&
					control.list !== undefined &&
					present
			);
		}

		return false;
	},

	childTemplate: (e: IJodit, key: string, value: string) =>
		`<span class="${key}">${e.i18n(value)}</span>`,

	tooltip: 'Insert className'
} as IControlType;

/**
 * Applying some className to selected text.
 * @example
 * ```js
 * const editor = new Jodit('#editor', {
 *	controls: {
 *		classSpan: {
 *			list: {
 *				class1: 'Classe 1',
 *				class2: 'Classe 2',
 *				class3: 'Classe 3',
 *				class4: 'Classe 4',
 *				class5: 'Classe 5'
 *			}
 *		}
 *	}
 * });
 */
export class classSpan extends Plugin {
	/** @override */
	buttons: Plugin['buttons'] = [
		{
			name: 'classSpan',
			group: 'font'
		}
	];

	/** @override */
	protected afterInit(jodit: IJodit): void {
		jodit.registerCommand(
			'applyClassName',
			(command: string, second: string, third: string): false => {
				jodit.s.applyStyle(undefined, {
					className: third
				});

				return false;
			}
		);
	}

	protected beforeDestruct(jodit: IJodit): void {}
}
