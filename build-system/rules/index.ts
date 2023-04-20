/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';
import css from './css';
import extraTypescript from './extra-typescript';
import langs from './langs';
import internalTypescript from './internal-typescript';
import svg from './svg';

export default (variables: Variables): RuleSetRule[] => {
	return [
		css(variables),
		extraTypescript(variables),
		langs(variables),
		internalTypescript(variables),
		svg(variables)
	];
};
