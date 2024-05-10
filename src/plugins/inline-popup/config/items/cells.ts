/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType } from 'jodit/types';
import type { Table } from 'jodit/modules/table/table';
import { isJoditObject, isString } from 'jodit/core/helpers/checker';
import { css } from 'jodit/core/helpers/utils/css';

const cmd = (control: IControlType): string =>
	control.args && isString(control.args[0])
		? control.args[0].toLowerCase()
		: '';

export default [
	'brushCell',
	{
		name: 'valign',
		list: ['Top', 'Middle', 'Bottom', 'Normal'],
		childTemplate: (_, __, value: string): string => value,
		exec: (editor, table, { control }): void => {
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
		exec: (editor, table, { control }): void | false => {
			if (!isJoditObject(editor)) {
				return;
			}

			if (!control.args) {
				return false;
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
		exec: (editor, table, { control }): void | false => {
			if (!isJoditObject(editor)) {
				return;
			}

			if (!control.args) {
				return false;
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
		exec: (editor, table, { control }): void | false => {
			if (!isJoditObject(editor)) {
				return;
			}

			if (!control.args) {
				return false;
			}

			const command = cmd(control);

			editor.execCommand(command, false, table);
			editor.e.fire('hidePopup');
		},
		tooltip: 'Delete'
	}
] as Array<IControlType | string>;
