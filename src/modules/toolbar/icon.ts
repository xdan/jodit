/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
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
