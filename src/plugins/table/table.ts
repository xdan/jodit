/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
}

pluginSystem.add('table', table);
