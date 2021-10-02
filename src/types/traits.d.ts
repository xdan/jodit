/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IDictionary } from './types';

export interface IMods {
	setMod(name: string, value: string | boolean | null): this;
	getMod(name: string): string | boolean | null;
	mods: IDictionary<string | boolean | null>;
}

export interface IElms {
	getElm(elementName: string): HTMLElement;
	getElms(elementName: string): HTMLElement[];
}
