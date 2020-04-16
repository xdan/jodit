/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IControlTypeStrong, IDictionary, IViewBased } from '../../types';
import { css, isString, trim } from '../helpers';

export class Icon {
	private static icons: IDictionary<string> = {};

	private static getIcon(name: string): string | undefined {
		return (
			Icon.icons[name] ||
			Icon.icons[name.replace(/-/g, '_')] ||
			Icon.icons[name.toLowerCase()]
		);
	}

	/**
	 * Check if icon exist in store
	 * @param name
	 */
	static exists(name: string): boolean {
		return this.getIcon(name) !== undefined;
	}

	/**
	 * Return SVG icon
	 *
	 * @param name icon
	 * @param [defaultValue='<span></span>']
	 */
	static get(name: string, defaultValue: string = '<span></span>'): string {
		return this.getIcon(name) || defaultValue;
	}

	/**
	 * Set SVG in store
	 *
	 * @param name
	 * @param value
	 */
	static set(name: string, value: string): void {
		this.icons[name.replace('_', '-')] = value;
	}
}

export function createIcon(
	jodit: IViewBased,
	clearName: string,
	control?: IControlTypeStrong
): HTMLElement {
	const icon: string = control ? control.icon || control.name : clearName;

	let iconSVG: string | void | HTMLElement = jodit.e.fire(
		'getIcon',
		icon,
		control,
		clearName
	);

	let iconElement: HTMLElement;

	if (control && control.iconURL && iconSVG === undefined) {
		iconElement = jodit.c.element('span');
		css(
			iconElement,
			'backgroundImage',
			'url(' + control.iconURL.replace('{basePath}', jodit.basePath) + ')'
		);
	} else {
		if (iconSVG === undefined) {
			iconSVG = Icon.get(Icon.exists(icon) ? icon : 'empty');
		}

		iconElement = isString(iconSVG)
			? jodit.c.fromHTML(trim(iconSVG))
			: iconSVG;
	}

	iconElement.classList.add('jodit_icon', 'jodit_icon_' + clearName);

	return iconElement;
}
