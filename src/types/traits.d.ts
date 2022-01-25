/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IDictionary, Nullable } from 'jodit/types';

export type ModType = string | boolean | null;

export interface IMods {
	/**
	 * Set/remove modification (null - remove)
	 */
	setMod(name: string, value: ModType): this;
	getMod(name: string): ModType;
	mods: IDictionary<ModType>;
}

export interface IElms {
	getElm(elementName: string): Nullable<HTMLElement>;
	getElms(elementName: string): HTMLElement[];
}
