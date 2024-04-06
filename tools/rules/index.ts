/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

import css from './css';
import extraTypescript from './extra-typescript';
import internalTypescript from './internal-typescript';
import langs from './langs';
import svg from './svg';

import type { RuleSetRule } from 'webpack';

export const rules = (variables: Variables): RuleSetRule[] => {
	return [
		css(variables),
		langs(variables),
		extraTypescript(variables),
		internalTypescript(variables, variables.superDirname),
		variables.superDirname !== variables.dirname
			? internalTypescript(variables, variables.dirname)
			: null,
		svg(variables)
	].filter(a => a != null) as RuleSetRule[];
};
