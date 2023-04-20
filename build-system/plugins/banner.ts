/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Variables } from '../variables';
import * as webpack from 'webpack';

export default ({ banner }: Variables): webpack.BannerPlugin => {
	return new webpack.BannerPlugin({
		banner,
		raw: true,
		entryOnly: true
	});
};
