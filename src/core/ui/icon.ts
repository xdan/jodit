/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui
 */

import type {
	CanUndef,
	IDictionary,
	IUIIconState,
	IViewBased
} from 'jodit/types';
import { css } from 'jodit/core/helpers/utils/css';
import { camelCase, kebabCase } from 'jodit/core/helpers';

export class Icon {
	private static __icons: IDictionary<string> = {};

	private static __getIcon(name: string): string | undefined {
		if (/<svg/i.test(name)) {
			return name;
		}

		const icon =
			Icon.__icons[name] ||
			Icon.__icons[name.replace(/-/g, '_')] ||
			Icon.__icons[name.replace(/_/g, '-')] ||
			Icon.__icons[camelCase(name)] ||
			Icon.__icons[kebabCase(name)] ||
			Icon.__icons[name.toLowerCase()];

		if (!isProd && !icon) {
			console.log(`Icon "${name}" not found`);
		}

		return icon;
	}

	/**
	 * Check if icon exist in store
	 */
	static exists(name: string): boolean {
		return this.__getIcon(name) !== undefined;
	}

	/**
	 * Return SVG icon
	 */
	static get(name: string, defaultValue: string = '<span></span>'): string {
		return this.__getIcon(name) || defaultValue;
	}

	/**
	 * Set SVG in store
	 */
	static set(name: string, value: string): typeof Icon {
		this.__icons[name.replace('_', '-')] = value;
		return this;
	}

	/**
	 * Make icon html element
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
