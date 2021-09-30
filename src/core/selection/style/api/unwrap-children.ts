/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitStyle } from '../commit-style';
import { Dom } from '../../../dom';
import { isSuitElement } from './is-suit-element';

/**
 * Unwrap all suit elements inside
 */
export function unwrapChildren(style: CommitStyle, font: HTMLElement): boolean {
	const needUnwrap: Node[] = [];

	let firstElementSuit: boolean | undefined;

	if (font.firstChild) {
		Dom.find(
			font.firstChild,
			(elm: Node | null) => {
				if (elm && isSuitElement(style, elm as HTMLElement)) {
					if (firstElementSuit === undefined) {
						firstElementSuit = true;
					}

					needUnwrap.push(elm);
				} else {
					if (firstElementSuit === undefined) {
						firstElementSuit = false;
					}
				}

				return false;
			},
			font,
			true
		);
	}

	needUnwrap.forEach(Dom.unwrap);

	return Boolean(firstElementSuit);
}
