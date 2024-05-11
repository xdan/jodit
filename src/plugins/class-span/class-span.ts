/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/class-span/README.md]]
 * @packageDocumentation
 * @module plugins/class-span
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { memorizeExec } from 'jodit/core/helpers/utils/utils';
import { Plugin } from 'jodit/core/plugin';
import { Icon } from 'jodit/core/ui/icon';
import { Config } from 'jodit/config';

import classSpanIcon from './class-span.svg';

Config.prototype.controls.classSpan = {
	command: 'applyClassName',

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

	isChildActive: (editor: IJodit, button): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBpx: HTMLElement =
				(Dom.closest(
					current,
					Dom.isElement,
					editor.editor
				) as HTMLElement) || editor.editor;

			return Boolean(
				button.control.args &&
					currentBpx.classList.contains(
						button.control.args[0].toString()
					)
			);
		}

		return false;
	},

	isActive: (editor: IJodit, btn): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBpx: HTMLElement =
				(Dom.closest(
					current,
					Dom.isElement,
					editor.editor
				) as HTMLElement) || editor.editor;

			let present: boolean = false;

			btn.control.list &&
				Object.keys(btn.control.list).forEach((className: string) => {
					if (currentBpx.classList.contains(className)) {
						present = true;
					}
				});

			return Boolean(
				currentBpx &&
					currentBpx !== editor.editor &&
					btn.control.list !== undefined &&
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
 * const editor = Jodit.make('#editor', {
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
			group: 'script'
		}
	];

	/** @override */
	protected override afterInit(jodit: IJodit): void {
		jodit.registerCommand(
			'applyClassName',
			(command: string, second: string, third: string): false => {
				jodit.s.commitStyle({
					attributes: {
						['class']: third
					}
				});

				return false;
			}
		);
	}

	/** @override */
	protected override beforeDestruct(): void {}
}

pluginSystem.add('classSpan', classSpan);
Icon.set('class-span', classSpanIcon);
