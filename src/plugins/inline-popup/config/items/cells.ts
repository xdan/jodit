/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { Table } from '../../../../modules';
import type { IControlType } from 'jodit/types';
import { isJoditObject, isString } from '../../../../core/helpers/checker';
import { css } from '../../../../core/helpers';
import { ColorPickerWidget, TabsWidget } from '../../../../modules/widget';

const cmd = (control: IControlType): string =>
	control.args && isString(control.args[0])
		? control.args[0].toLowerCase()
		: '';

export default [
	{
		name: 'brush',
		popup: (editor, _, _1, close): void | false | HTMLElement => {
			if (!isJoditObject(editor)) {
				return;
			}

			const tableModule = editor.getInstance<Table>('Table', editor.o),
				selected = tableModule.getAllSelectedCells();

			if (!selected.length) {
				return false;
			}

			const makeColorPicker = (key: string) =>
				ColorPickerWidget(
					editor,
					(value: string) => {
						selected.forEach(cell => {
							css(cell, key, value);
						});

						editor.lock();
						editor.setEditorValue();
						close();
						editor.unlock();
					},
					css(selected[0], key) as string
				);

			return TabsWidget(editor, [
				{
					name: 'Background',
					content: makeColorPicker('background-color')
				},
				{ name: 'Text', content: makeColorPicker('color') },
				{ name: 'Border', content: makeColorPicker('border-color') }
			]);
		},
		tooltip: 'Background'
	},
	{
		name: 'valign',
		list: ['Top', 'Middle', 'Bottom', 'Normal'],
		childTemplate: (_, __, value: string) => value,
		exec: (editor, table, { control }) => {
			const command = cmd(control);

			editor
				.getInstance<Table>('Table', editor.o)
				.getAllSelectedCells()
				.forEach((cell: HTMLTableCellElement) => {
					css(
						cell,
						'vertical-align',
						command === 'normal' ? '' : command
					);
				});
		},
		tooltip: 'Vertical align'
	},
	{
		name: 'splitv',
		list: {
			tablesplitv: 'Split vertical',
			tablesplitg: 'Split horizontal'
		},
		tooltip: 'Split'
	},
	{
		name: 'align',
		icon: 'left'
	},
	'\n',
	{
		name: 'merge',
		command: 'tablemerge',
		tooltip: 'Merge'
	},
	{
		name: 'addcolumn',
		list: {
			tableaddcolumnbefore: 'Insert column before',
			tableaddcolumnafter: 'Insert column after'
		},
		exec: (editor, table, { control }) => {
			if (!isJoditObject(editor)) {
				return;
			}

			const command = cmd(control);

			editor.execCommand(command, false, table);
		},
		tooltip: 'Add column'
	},
	{
		name: 'addrow',
		list: {
			tableaddrowbefore: 'Insert row above',
			tableaddrowafter: 'Insert row below'
		},
		exec: (editor, table, { control }) => {
			if (!isJoditObject(editor)) {
				return;
			}

			const command = cmd(control);

			editor.execCommand(command, false, table);
		},
		tooltip: 'Add row'
	},
	{
		name: 'delete',
		icon: 'bin',
		list: {
			tablebin: 'Delete table',
			tablebinrow: 'Delete row',
			tablebincolumn: 'Delete column',
			tableempty: 'Empty cell'
		},
		exec: (editor, table, { control }) => {
			if (!isJoditObject(editor)) {
				return;
			}

			const command = cmd(control);

			editor.execCommand(command, false, table);
			editor.e.fire('hidePopup');
		},
		tooltip: 'Delete'
	}
] as Array<IControlType | string>;
