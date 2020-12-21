/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { CanUndef, HTMLTagNames, IDictionary } from './types';

export type ClassNameValue = string | null | undefined;

//export type IClassName = IDictionary<ClassNameValue>;

export interface IClassNameOptions {
//	className: CanUndef<IClassName>;
	className: CanUndef<ClassNameValue>;
	element: CanUndef<HTMLTagNames>;
	defaultTag: CanUndef<HTMLTagNames>;
}
