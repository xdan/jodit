/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module traits
 */

import type {
	IContainer,
	IDictionary,
	IMods,
	IComponent,
	ModType
} from 'jodit/types';
import { toArray } from 'jodit/core/helpers/array/to-array';
import { isVoid } from 'jodit/core/helpers/checker/is-void';

export abstract class Mods implements IMods {
	abstract mods: IDictionary;

	afterSetMod(name: string, value: ModType): void {}

	/**
	 * Set/remove BEM class modification
	 *
	 * @param value - if null, mod will be removed
	 */
	setMod<T extends IComponent & IContainer & IMods>(
		this: T,
		name: string,
		value: ModType,
		container?: HTMLElement
	): T {
		name = name.toLowerCase();

		if (this.mods[name] === value) {
			return this;
		}

		const mod = `${this.componentName}_${name}`,
			cl = (container || this.container).classList;

		toArray(cl).forEach(className => {
			if (className.indexOf(mod) === 0) {
				cl.remove(className);
			}
		});

		!isVoid(value) &&
			value !== '' &&
			cl.add(`${mod}_${value.toString().toLowerCase()}`);

		this.mods[name] = value;

		this.afterSetMod(name, value);

		return this;
	}

	/**
	 * Get BEM class modification value
	 */
	getMod(this: IMods, name: string): ModType {
		return this.mods[name] ?? null;
	}
}
