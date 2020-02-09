/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { HTMLTagNames, IJodit, markerInfo } from '../types';
import { IControlType } from '../types/toolbar';

Config.prototype.controls.paragraph = {
	command: 'formatBlock',
	getLabel: (editor: IJodit, btn, button): boolean => {
		const current: Node | false = editor.selection.current();

		if (current && editor.options.textIcons) {
			const currentBox: HTMLElement =
					(Dom.closest(
						current,
						node => Dom.isBlock(node, editor.editorWindow),
						editor.editor
					) as HTMLElement) || editor.editor,
				currentValue: string = currentBox.nodeName.toLowerCase(),
				list = btn.list as any;

			if (
				button &&
				btn.data &&
				btn.data.currentValue !== currentValue &&
				btn.list &&
				list[currentValue]
			) {
				button.textBox.innerHTML = `<span>${editor.i18n(
					list[currentValue]
				)}</span>`;

				(button.textBox.firstChild as HTMLElement).classList.add(
					'jodit_icon'
				);

				btn.data.currentValue = currentValue;
			}
		}

		return false;
	},

	exec: (editor: IJodit, event, control: IControlType) => {
		editor.execCommand(
			control.command as string,
			false,
			control.args ? control.args[0] : undefined
		);
	},

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

	isActiveChild: (editor: IJodit, control: IControlType): boolean => {
		const current: Node | false = editor.selection.current();

		if (current) {
			const currentBox: HTMLElement = Dom.closest(
				current,
				node => Dom.isBlock(node, editor.editorWindow),
				editor.editor
			) as HTMLElement;

			return (
				currentBox &&
				currentBox !== editor.editor &&
				control.args !== undefined &&
				currentBox.nodeName.toLowerCase() === control.args[0]
			);
		}

		return false;
	},

	isActive: (editor: IJodit, control: IControlType): boolean => {
		const current: Node | false = editor.selection.current();

		if (current) {
			const currentBpx: HTMLElement = Dom.closest(
				current,
				node => Dom.isBlock(node, editor.editorWindow),
				editor.editor
			) as HTMLElement;

			return (
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

	template: (editor: IJodit, key: string, value: string) => {
		return `<${key} class="jodit_list_element"><span>${editor.i18n(
			value
		)}</span></${key}></li>`;
	},

	tooltip: 'Insert format block'
} as IControlType;

/**
 * Process command - `formatblock`
 *
 * @param {Jodit} editor
 */
export function formatBlock(editor: IJodit) {
	editor.registerCommand(
		'formatblock',
		(command: string, second: string, third: string): false | void => {
			editor.selection.focus();
			let work: boolean = false;

			editor.selection.eachSelection((current: Node) => {
				const selectionInfo: markerInfo[] = editor.selection.save();
				let currentBox: HTMLElement | false = current
					? (Dom.up(
							current,
							node => Dom.isBlock(node, editor.editorWindow),
							editor.editor
					  ) as HTMLElement)
					: false;

				if ((!currentBox || Dom.isTag(currentBox, 'li')) && current) {
					currentBox = Dom.wrapInline(
						current,
						editor.options.enter,
						editor
					);
				}

				if (!currentBox) {
					editor.selection.restore(selectionInfo);
					return;
				}

				if (!currentBox.tagName.match(/TD|TH|TBODY|TABLE|THEAD/i)) {
					if (
						third === editor.options.enterBlock.toLowerCase() &&
						Dom.isTag(currentBox.parentNode, 'li')
					) {
						Dom.unwrap(currentBox);
					} else {
						Dom.replace(
							currentBox,
							third as HTMLTagNames,
							editor.create.inside,
							true,
							false
						);
					}
				} else {
					if (!editor.selection.isCollapsed()) {
						editor.selection.applyCSS({}, <HTMLTagNames>third);
					} else {
						Dom.wrapInline(current, <HTMLTagNames>third, editor);
					}
				}

				work = true;
				editor.selection.restore(selectionInfo);
			});

			if (!work) {
				const br = editor.create.inside.element('br');
				const currentBox = editor.create.inside.element(third, br);
				editor.selection.insertNode(currentBox, false);
				editor.selection.setCursorIn(currentBox);
			}

			editor.setEditorValue();

			return false;
		}
	);
}
