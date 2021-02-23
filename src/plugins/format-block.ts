/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { HTMLTagNames, IJodit, IControlType, IDictionary } from '../types';
import { Config } from '../config';
import { Dom } from '../modules/';
import { memorizeExec } from '../core/helpers';

Config.prototype.controls.paragraph = {
	command: 'formatBlock',
	update(button): boolean {
		const editor = button.j as IJodit,
			control = button.control,
			current = editor.s.current();

		if (current && editor.o.textIcons) {
			const currentBox =
					Dom.closest(
						current,
						node => Dom.isBlock(node, editor.ew),
						editor.editor
					) || editor.editor,
				currentValue = currentBox.nodeName.toLowerCase(),
				list = control.list as IDictionary;

			if (
				button &&
				control.data &&
				control.data.currentValue !== currentValue &&
				list &&
				list[currentValue]
			) {
				if (editor.o.textIcons) {
					button.state.text = currentValue;
				} else {
					button.state.icon.name = currentValue;
				}

				control.data.currentValue = currentValue;
			}
		}

		return false;
	},

	exec: memorizeExec,

	data: {
		currentValue: 'left'
	},

	list: {
		p: 'Normal',
		h1: 'Heading 1',
		h2: 'Heading 2',
		h3: 'Heading 3',
		h4: 'Heading 4',
		blockquote: 'Quote'
	},

	isChildActive: (editor: IJodit, control: IControlType): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBox = Dom.closest(
				current,
				node => Dom.isBlock(node, editor.ew),
				editor.editor
			);

			return Boolean(
				currentBox &&
					currentBox !== editor.editor &&
					control.args !== undefined &&
					currentBox.nodeName.toLowerCase() === control.args[0]
			);
		}

		return false;
	},

	isActive: (editor: IJodit, control: IControlType): boolean => {
		const current = editor.s.current();

		if (current) {
			const currentBpx = Dom.closest(
				current,
				node => Dom.isBlock(node, editor.ew),
				editor.editor
			);

			return Boolean(
				currentBpx &&
					currentBpx !== editor.editor &&
					control.list !== undefined &&
					!Dom.isTag(currentBpx, 'p') &&
					((control.list as any)[
						currentBpx.nodeName.toLowerCase()
					] as any) !== undefined
			);
		}

		return false;
	},

	childTemplate: (e: IJodit, key: string, value: string) =>
		`<${key} style="margin:0;padding:0"><span>${e.i18n(
			value
		)}</span></${key}>`,

	tooltip: 'Insert format block'
} as IControlType;

/**
 * Process command - `formatblock`
 *
 * @param {Jodit} editor
 */
export function formatBlock(editor: IJodit): void {
	editor.registerButton({
		name: 'paragraph',
		group: 'font'
	});

	editor.registerCommand(
		'formatblock',
		(command: string, second: string, third: string): false | void => {
			editor.s.applyStyle(undefined, {
				element: third as HTMLTagNames
			});

			editor.setEditorValue();

			return false;
		}
	);
}
