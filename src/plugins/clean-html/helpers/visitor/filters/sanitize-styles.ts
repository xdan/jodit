/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/clean-html
 */

import type { IDictionary, IJodit } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';

/**
 * Filter CSS properties in style attributes based on allowedStyles whitelist
 * @private
 */
export function sanitizeStyles(
	jodit: IJodit,
	nodeElm: Node,
	hadEffect: boolean
): boolean {
	const allowedStyles = jodit.o.cleanHTML.allowedStyles;

	if (!allowedStyles || !Dom.isElement(nodeElm)) {
		return hadEffect;
	}

	const style = (nodeElm as HTMLElement).getAttribute('style');

	if (!style) {
		return hadEffect;
	}

	const tagName = nodeElm.nodeName.toLowerCase();
	const allowed = getAllowedPropsForTag(tagName, allowedStyles);

	if (!allowed) {
		return hadEffect;
	}

	const filtered = filterStyleProperties(style, allowed);

	if (filtered !== style) {
		if (filtered) {
			(nodeElm as HTMLElement).setAttribute('style', filtered);
		} else {
			(nodeElm as HTMLElement).removeAttribute('style');
		}

		return true;
	}

	return hadEffect;
}

function getAllowedPropsForTag(
	tagName: string,
	allowedStyles: IDictionary<string[]>
): Set<string> | null {
	const tagSpecific = allowedStyles[tagName];
	const global = allowedStyles['*'];

	if (!tagSpecific && !global) {
		return null;
	}

	const set = new Set<string>();

	if (global) {
		for (const prop of global) {
			set.add(prop.toLowerCase());
		}
	}

	if (tagSpecific) {
		for (const prop of tagSpecific) {
			set.add(prop.toLowerCase());
		}
	}

	return set;
}

function filterStyleProperties(style: string, allowed: Set<string>): string {
	return style
		.split(';')
		.map(s => s.trim())
		.filter(s => {
			if (!s) {
				return false;
			}

			const colonIdx = s.indexOf(':');

			if (colonIdx === -1) {
				return false;
			}

			const prop = s.substring(0, colonIdx).trim().toLowerCase();

			return allowed.has(prop);
		})
		.join('; ')
		.replace(/;\s*$/, '');
}
