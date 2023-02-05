/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IComponent, IDictionary } from './types';

export type DecoratorHandler = <T extends IComponent & IDictionary>(
	target: T,
	propertyKey: string
) => void | PropertyDescriptor;
