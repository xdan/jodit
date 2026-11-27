/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/table/README.md]]
 * @packageDocumentation
 * @module plugins/table
 */

import type { IJodit } from 'jodit/types';
import { pluginSystem } from 'jodit/core/global';

import './config';

import './table.less';

export function table(editor: IJodit): void {
	editor.registerButton({
		name: 'table',
		group: 'insert'
	});

	editor.e.on('afterInit afterAddPlace', () => {
		// With `editHTMLDocumentMode`, the body is part of the value
		editor.editor.classList.toggle(
			'jodit-wysiwyg_page-tables',
			editor.o.table.leaveStylesToPage && !editor.o.editHTMLDocumentMode
		);
	});
}

pluginSystem.add('table', table);
