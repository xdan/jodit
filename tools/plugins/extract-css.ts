/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import { fileName } from '../utils/filename';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default (vars: Variables): MiniCssExtractPlugin => {
	return new MiniCssExtractPlugin({
		filename: fileName(vars)('[name]') + '.css'
	});
};
