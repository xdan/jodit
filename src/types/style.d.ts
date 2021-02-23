/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { CanUndef, HTMLTagNames, IDictionary } from './types';

export type StyleValue = number | string | null | undefined;

export type IStyle = IDictionary<StyleValue>;

export interface IStyleOptions {
	style: CanUndef<IStyle>;
	element: CanUndef<HTMLTagNames>;
	className: CanUndef<string>;
	defaultTag: CanUndef<HTMLTagNames>;
}
