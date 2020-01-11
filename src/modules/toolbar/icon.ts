/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary } from '../../types';

export class ToolbarIcon {
	private static icons: IDictionary<string> = {};

	private static get(name: string): string | undefined {
		return ToolbarIcon.icons[name] ||
			ToolbarIcon.icons[name.replace(/-/g, '_')] ||
			ToolbarIcon.icons[name.toLowerCase()];
	}

	/**
	 * Check if icon exist in store
	 * @param name
	 */
	static exists(name: string): boolean {
		return this.get(name) !== undefined;
	}

	/**
	 * Return SVG icon
	 *
	 * @param name icon
	 * @param [defaultValue='<span></span>']
	 */
	static getIcon(
		name: string,
		defaultValue: string = '<span></span>'
	): string {
		return this.get(name) || defaultValue;
	}

	/**
	 * Set SVG in store
	 *
	 * @param name
	 * @param value
	 */
	static setIcon(
		name: string,
		value: string
	): void {
		this.icons[name.replace('_', '-')] = value;
	}
}
