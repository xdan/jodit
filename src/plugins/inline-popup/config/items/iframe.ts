/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/inline-popup
 */

import type { IControlType, IJodit } from 'jodit/types';
import { align } from './img';

export default [
	{
		name: 'bin',
		tooltip: 'Delete',
		exec: (editor: IJodit, image) => {
			image && editor.s.removeNode(image);
		}
	},
	align
] as Array<IControlType | string>;
