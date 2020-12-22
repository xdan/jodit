/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IJodit } from '../types/';
import { Config } from '../config';
import { Dom } from '../core/dom';
import { dataBind, isVoid } from '../core/helpers';

Config.prototype.controls.classSpan = {
	command: 'classSpan',
	
	exec: (editor: IJodit, event, { control }): void | false => {
		const key = `button${control.command}`;

		let value = (control.args && control.args[0]) || dataBind(editor, key);

		if (isVoid(value)) {
			return false;
		}

		dataBind(editor, key, value);

		editor.execCommand(
			control.command as string,
			false,
			value || undefined
		);
	},

	list: {
		// TODO BB : à voir comment rendre ça personalisable
		class1: 'Classe 1',
		class2: 'Classe 2',
		class3: 'Classe 3',
		class4: 'Classe 4',
		class5: 'Classe 5'
	},

	// TODO BB : à ajouter pour améiorer l'interface en s'inspirant de font.ts fontsize
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
					currentBpx.classList.contains (control.args[0].toString())
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

				let present:boolean = false;

				control.list && Object.keys(control.list).forEach ((className: string) => {
					if (currentBpx.classList.contains (className)){
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
		`<span class="${key}">${e.i18n(
			value
		)}</span>`,

	tooltip: 'Insert className'
} as IControlType;

/**
 * Process command - `classSpan`
 *
 * @param {Jodit} editor
 */
export function classSpan(editor: IJodit): void {
	editor.registerButton({
		name: 'classSpan',
		group: 'font'
	});

	editor.registerCommand(
		'classSpan',
		(command: string, second: string, third: string): false | void => {
			editor.s.applyClassName(third);

			return false;
		}
	);
}