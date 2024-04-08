/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import type { RuleSetRule } from 'webpack';

export default ({
	debug,
	isTest,
	superDirname
}: Variables): Array<RuleSetRule | string> => [
	debug || isTest ? 'style-loader' : MiniCssExtractPlugin.loader,
	{
		loader: 'css-loader',
		options: {
			sourceMap: debug,
			importLoaders: 1
		}
	},
	{
		loader: path.resolve(
			superDirname,
			'./tools/loaders/css-variables-prefixes.ts'
		)
	},
	{
		loader: 'less-loader',
		options: {
			sourceMap: debug
		}
	}
];
