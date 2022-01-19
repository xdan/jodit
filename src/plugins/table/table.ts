/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/table
 */

import type { IJodit } from 'jodit/types';

export function table(editor: IJodit): void {
	editor.registerButton({
		name: 'table',
		group: 'insert'
	});
}
