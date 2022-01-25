/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type { IDictionary } from './types';
import { Nullable } from './types';

export interface IMods {
	/**
	 * Set/remove modification (null - remove)
	 */
	setMod(name: string, value: string | boolean | null): this;
	getMod(name: string): string | boolean | null;
	mods: IDictionary<string | boolean | null>;
}

export interface IElms {
	getElm(elementName: string): Nullable<HTMLElement>;
	getElms(elementName: string): HTMLElement[];
}
