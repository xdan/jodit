/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/class-span
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { Config } from 'jodit/config';
import { Dom } from 'jodit/core/dom';
import { memorizeExec } from 'jodit/core/helpers';

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
					Dom.isElement,
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
					Dom.isElement,
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
 * ```
 */
export class classSpan extends Plugin {
	/** @override */
	override buttons: Plugin['buttons'] = [
		{
			name: 'classSpan',
			group: 'font'
		}
	];

	/** @override */
	protected override afterInit(jodit: IJodit): void {
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

	/** @override */
	protected override beforeDestruct(): void {}
}
