/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module core/vdom
 */

import type { HTMLTagNames, IDictionary } from 'jodit/types';
import type { IVDom } from '../interface';

export function attrsToDict(elm: Node): IDictionary<string> {
	const result: IDictionary<string> = {};

	if (elm.nodeName === 'SCRIPT') {
		result.textContent = elm.textContent ?? '';
	}

	if (elm.nodeType === Node.TEXT_NODE) {
		result.nodeValue = elm.nodeValue ?? '';
	}

	if (elm instanceof HTMLElement) {
		for (let i = 0; i < elm.attributes.length; i += 1) {
			const attr = elm.attributes.item(i);

			if (attr) {
				result[attr.name] = attr.value;
			}
		}
	}

	return result;
}

export function domToVDom(elm: Node, noNode: boolean = true): IVDom {
	if (elm.nodeType === Node.TEXT_NODE) {
		return {
			type: 'TEXT_ELEMENT',
			props: {
				children: [],
				nodeValue: elm.nodeValue ?? ''
			}
		};
	}

	return {
		type: elm.nodeName.toLowerCase() as HTMLTagNames,
		props: {
			children: Array.from(elm.childNodes).map(n => domToVDom(n, noNode)),
			...attrsToDict(elm)
		}
	};
}
