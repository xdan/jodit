/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { HTMLTagNames, IDictionary } from './types';

export type StyleValue = number | string | null | undefined;

export type IStyle = IDictionary<StyleValue>;
export type IAttributes = {
	[K in string]: IStyle | string | number | boolean | null;
};

export interface IStyleOptions {
	element?: HTMLTagNames;
	attributes?: IAttributes;
	defaultTag?: HTMLTagNames;
	/** @deprecated */
	style?: IStyle;
	/** @deprecated */
	className?: string;
}

export type CommitMode =
	| 'initial'
	| 'wrap'
	| 'unwrap'
	| 'change'
	| 'unset'
	| 'replace';
