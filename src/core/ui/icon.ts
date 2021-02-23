/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type {
	CanUndef,
	IDictionary,
	IUIIconState,
	IViewBased
} from '../../types';
import { css } from '../helpers/css';

export class Icon {
	private static icons: IDictionary<string> = {};

	private static getIcon(name: string): string | undefined {
		if (/^<svg/i.test(name)) {
			return name;
		}

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

	/**
	 * Make icon html element
	 *
	 * @param jodit
	 * @param icon
	 */
	static makeIcon(jodit: IViewBased, icon: IUIIconState): CanUndef<Node> {
		let iconElement: CanUndef<HTMLElement>;

		if (icon) {
			const clearName = icon.name.replace(/[^a-zA-Z0-9]/g, '_');

			if (icon.iconURL) {
				iconElement = jodit.c.span();

				css(
					iconElement,
					'backgroundImage',
					'url(' +
						icon.iconURL.replace(
							'{basePath}',
							jodit?.basePath || ''
						) +
						')'
				);
			} else {
				const svg =
					jodit.e.fire('getIcon', icon.name, icon, clearName) ||
					Icon.get(icon.name, '') ||
					jodit.o.extraIcons?.[icon.name];

				if (svg) {
					iconElement = jodit.c.fromHTML(svg.trim());

					if (!/^<svg/i.test(icon.name)) {
						iconElement.classList.add('jodit-icon_' + clearName);
					}
				}
			}
		}

		if (iconElement) {
			iconElement.classList.add('jodit-icon');
			iconElement.style.fill = icon.fill;
		}

		return iconElement;
	}
}
