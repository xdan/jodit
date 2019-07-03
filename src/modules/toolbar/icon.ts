/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IDictionary } from '../../types';

export class ToolbarIcon {
	static icons: IDictionary<string> = {};

	static exists(name: string): boolean {
		return ToolbarIcon.icons[name] !== undefined;
	}

	/**
	 * Return SVG icon
	 *
	 * @param {string} name icon
	 * @param {string} [defaultValue='<span></span>']
	 * @return {string}
	 */
	static getIcon(
		name: string,
		defaultValue: string = '<span></span>'
	): string {
		return ToolbarIcon.icons[name] !== undefined
			? ToolbarIcon.icons[name]
			: defaultValue;
	}
}
