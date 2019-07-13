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
	 * @param name icon
	 * @param [defaultValue='<span></span>']
	 */
	static getIcon(
		name: string,
		defaultValue: string = '<span></span>'
	): string {

		const icon =
			ToolbarIcon.icons[name] ||
			ToolbarIcon.icons[name.replace(/-/g, '_')] ||
			ToolbarIcon.icons[name.toLowerCase()];

		return icon || defaultValue;
	}
}
