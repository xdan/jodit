/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../config';
import { Dom } from '../modules/';
import { HTMLTagNames, IJodit, markerInfo, IControlType } from '../types';

Config.prototype.controls.paragraph = {
	command: 'formatBlock',
	update(button): boolean {
		const editor = button.j as IJodit,
			control = button.control,
			current = editor.selection.current();

		if (current && editor.o.textIcons) {
			const currentBox: HTMLElement =
					(Dom.closest(
						current,
						node => Dom.isBlock(node, editor.editorWindow),
						editor.editor
					) as HTMLElement) || editor.editor,
				currentValue: string = currentBox.nodeName.toLowerCase(),
				list = control.list as any;

			if (
				button &&
				control.data &&
				control.data.currentValue !== currentValue &&
				control.list &&
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
		const current = editor.selection.current();

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
		const current = editor.selection.current();

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

	template: (e: IJodit, key: string, value: string) =>
		`<${key}><span>${e.i18n(value)}</span></${key}>`,

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
						editor.o.enter,
						editor
					);
				}

				if (!currentBox) {
					editor.selection.restore(selectionInfo);
					return;
				}

				if (!currentBox.tagName.match(/TD|TH|TBODY|TABLE|THEAD/i)) {
					if (
						third === editor.o.enterBlock.toLowerCase() &&
						Dom.isTag(currentBox.parentNode, 'li')
					) {
						Dom.unwrap(currentBox);
					} else {
						Dom.replace(
							currentBox,
							third as HTMLTagNames,
							editor.createInside,
							true,
							false
						);
					}
				} else {
					if (!editor.selection.isCollapsed()) {
						editor.selection.applyCSS(
							{},
							{
								alternativeNodeName: <HTMLTagNames>third
							}
						);
					} else {
						Dom.wrapInline(current, <HTMLTagNames>third, editor);
					}
				}

				work = true;
				editor.selection.restore(selectionInfo);
			});

			if (!work) {
				const br = editor.createInside.element('br');
				const currentBox = editor.createInside.element(third, br);
				editor.selection.insertNode(currentBox, false);
				editor.selection.setCursorIn(currentBox);
			}

			editor.setEditorValue();

			return false;
		}
	);
}
