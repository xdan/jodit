/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
import { IS_PROD } from 'jodit/core/constants';
import { camelCase, kebabCase } from 'jodit/core/helpers';
import { css } from 'jodit/core/helpers/utils/css';

export class Icon {
	private static icons: IDictionary<string> = {};

	private static getIcon(name: string): string | undefined {
		if (/<svg/i.test(name)) {
			return name;
		}

		const icon =
			Icon.icons[name] ||
			Icon.icons[name.replace(/-/g, '_')] ||
			Icon.icons[name.replace(/_/g, '-')] ||
			Icon.icons[camelCase(name)] ||
			Icon.icons[kebabCase(name)] ||
			Icon.icons[name.toLowerCase()];

		if (!IS_PROD && !icon) {
			console.warn(`Icon "${name}" not found`);
		}

		return icon;
	}

	/**
	 * Check if icon exist in store
	 */
	static exists(name: string): boolean {
		return this.getIcon(name) !== undefined;
	}

	/**
	 * Return SVG icon
	 */
	static get(name: string, defaultValue: string = '<span></span>'): string {
		return this.getIcon(name) || defaultValue;
	}

	/**
	 * Set SVG in store
	 */
	static set(name: string, value: string): typeof Icon {
		this.icons[name.replace('_', '-')] = value;
		return this;
	}

	private static __cache: Map<string, HTMLElement> = new Map();

	/**
	 * Make icon html element
	 */
	static makeIcon(jodit: IViewBased, icon: IUIIconState): CanUndef<Node> {
		if (!icon) {
			return;
		}

		let iconElement: CanUndef<HTMLElement>;

		const { name, iconURL, fill } = icon;
		const clearName = name.replace(/[^a-zA-Z0-9]/g, '_');

		let iconFromEvent: CanUndef<string>;
		if (!/<svg/.test(name)) {
			iconFromEvent = jodit.o.getIcon?.(name, clearName);
		}

		const cacheKey = `${name}${iconURL}${fill}${iconFromEvent ?? ''}`;

		if (jodit.o.cache && this.__cache.has(cacheKey)) {
			return this.__cache.get(cacheKey)?.cloneNode(true);
		}

		if (iconURL) {
			iconElement = jodit.c.span();

			css(
				iconElement,
				'backgroundImage',
				'url(' +
					iconURL.replace('{basePath}', jodit?.basePath || '') +
					')'
			);
		} else {
			const svg =
				iconFromEvent ||
				Icon.get(name, '') ||
				jodit.o.extraIcons?.[name];

			if (svg) {
				iconElement = jodit.c.fromHTML(svg.trim());

				if (!/^<svg/i.test(name)) {
					iconElement.classList.add('jodit-icon_' + clearName);
				}
			}
		}

		if (iconElement) {
			iconElement.classList.add('jodit-icon');
			iconElement.style.fill = fill;
			jodit.o.cache &&
				this.__cache.set(
					cacheKey,
					iconElement.cloneNode(true) as HTMLElement
				);
		}

		return iconElement;
	}
}
