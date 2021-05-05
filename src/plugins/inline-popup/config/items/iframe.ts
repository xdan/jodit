/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IControlType, IJodit } from '../../../../types';
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
