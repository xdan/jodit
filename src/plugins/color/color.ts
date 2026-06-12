/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/color/README.md]]
 * @packageDocumentation
 * @module plugins/color
 */

import type { IJodit } from 'jodit/types';
import type { Table } from 'jodit/modules';
import { pluginSystem } from 'jodit/core/global';
import { normalizeColor } from 'jodit/core/helpers/';

import './config';

/**
 * Process commands `background` and `forecolor`
 */
export function color(editor: IJodit): void {
	editor.registerButton({
		name: 'brush',
		group: 'color'
	});

	const callback = (
		command: string,
		second: string,
		third: string
	): false | void => {
		const colorHEX: string | false = normalizeColor(third);
		const value = !colorHEX ? '' : (colorHEX as string);

		const style =
			command === 'background'
				? { backgroundColor: value }
				: { color: value };

		// Cells selected with the `select-cells` plugin drop or collapse the
		// native range, so `commitStyle` would paint a pending caret format
		// outside the table instead of the selection the user sees. Apply the
		// style to the content of every selected cell instead. See #1250
		const selectedCells = editor
			.getInstance<Table>('Table', editor.o)
			.getAllSelectedCells();

		if (selectedCells.length && editor.s.isCollapsed()) {
			selectedCells.forEach(cell => {
				editor.s.select(cell, true);
				editor.s.commitStyle({ attributes: { style } });
			});

			editor.s.sel?.removeAllRanges();
		} else {
			editor.s.commitStyle({ attributes: { style } });
		}

		editor.synchronizeValues();
		return false;
	};

	editor
		.registerCommand('forecolor', callback)
		.registerCommand('background', callback);
}

pluginSystem.add('color', color);
