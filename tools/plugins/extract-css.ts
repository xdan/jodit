/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { fileName } from '../utils/filename';

export default (vars: Variables): MiniCssExtractPlugin => {
	return new MiniCssExtractPlugin({
		filename: fileName(vars)('[name]') + '.css'
	});
};
