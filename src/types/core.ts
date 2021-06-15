/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Component } from '../core/component';
import type { IDictionary } from './types';

export type DecoratorHandler = <T extends Component & IDictionary>(
	target: T,
	propertyKey: string
) => void;
