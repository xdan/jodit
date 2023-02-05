/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { HTMLTagNames, IDictionary } from './types';
import { IJodit } from './jodit';

export type StyleValue = number | string | null | undefined;

export type IStyle = IDictionary<StyleValue>;
export type IAttributes = {
	[K in string]: IStyle | string | number | boolean | null;
};

export interface IStyleOptions {
	element?: HTMLTagNames;
	attributes?: IAttributes;
	defaultTag?: HTMLTagNames;
	hooks?: {
		beforeWrapList?(
			mode: CommitMode,
			li: HTMLElement,
			style: ICommitStyle
		): void;
		afterWrapList?(
			mode: CommitMode,
			li: HTMLElement,
			style: ICommitStyle
		): void;
		beforeToggleList?(
			mode: CommitMode,
			list: HTMLElement,
			style: ICommitStyle
		): void | CommitMode;
		beforeUnwrapList?(
			mode: 'unwrap',
			list: HTMLElement,
			style: ICommitStyle
		): void | CommitMode;
		afterToggleList?(
			mode: CommitMode,
			list: HTMLElement,
			style: ICommitStyle
		): void;
		afterToggleAttribute?(
			mode: CommitMode,
			elm: HTMLElement,
			key: string,
			value?: string | number | null | boolean
		): void;
	};
	/** @deprecated */
	style?: IStyle;
	/** @deprecated */
	className?: string;
}

export interface ICommitStyle {
	isApplied(elm: HTMLElement, key: string): boolean;

	setApplied(elm: HTMLElement, key: string): void;

	readonly elementIsList: boolean;

	readonly element: HTMLTagNames;

	/**
	 * New element is block
	 */
	readonly elementIsBlock: boolean;

	/**
	 * The commit applies the tag change
	 */
	readonly isElementCommit: boolean;

	readonly defaultTag: HTMLTagNames;

	readonly elementIsDefault: Boolean;
	readonly options: IStyleOptions;

	apply(jodit: IJodit): void;
}

export type CommitMode =
	| 'initial'
	| 'wrap'
	| 'unwrap'
	| 'change'
	| 'unset'
	| 'replace';
