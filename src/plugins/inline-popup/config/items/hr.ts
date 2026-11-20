/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IJodit } from 'jodit/types';

export default [
	{
		name: 'delete',
		icon: 'bin',
		tooltip: 'Delete',
		exec: (editor: IJodit, line): void => {
			line && editor.e.fire('deleteHorizontalRule', line);
		}
	}
] as Array<IControlType | string>;
