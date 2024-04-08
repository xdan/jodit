/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module traits
 */

import type {
	IComponent,
	IContainer,
	IDictionary,
	IMods,
	ModType
} from 'jodit/types';
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
		const oldValue = this.mods[name];

		if (oldValue === value) {
			return this;
		}

		const mod = `${this.componentName}_${name}_`,
			cl = (container || this.container).classList;

		if (oldValue != null) {
			cl.remove(`${mod}${oldValue.toString().toLowerCase()}`);
		}

		!isVoid(value) &&
			value !== '' &&
			cl.add(`${mod}${value.toString().toLowerCase()}`);

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
