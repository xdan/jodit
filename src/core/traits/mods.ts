/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IComponent, IContainer, IDictionary, IMods } from '../../types';
import { toArray } from '../helpers/array/to-array';

export abstract class Mods implements IMods {
	abstract mods: IDictionary<string | boolean | null>;
	abstract componentName: string;
	abstract container: HTMLElement;

	abstract setMod(name: string, value: string | boolean | null): this;

	abstract getMod(name: string): string | boolean | null;

	/**
	 * Set/remove BEM class modification
	 *
	 * @param value - if null, mod will be removed
	 */
	static setMod(
		this: IComponent & IContainer & Mods,
		name: string,
		value: string | boolean | null,
		container?: HTMLElement
	): void {
		name = name.toLowerCase();

		if (this.mods[name] === value) {
			return;
		}

		const mod = `${this.componentName}_${name}`,
			cl = (container || this.container).classList;

		toArray(cl).forEach(className => {
			if (className.indexOf(mod) === 0) {
				cl.remove(className);
			}
		});

		value != null &&
			value !== '' &&
			cl.add(`${mod}_${value.toString().toLowerCase()}`);

		this.mods[name] = value;
	}

	/**
	 * Get BEM class modification value
	 */
	static getMod(
		this: IComponent & IContainer & Mods,
		name: string
	): string | boolean | null {
		return this.mods[name] ?? null;
	}
}
