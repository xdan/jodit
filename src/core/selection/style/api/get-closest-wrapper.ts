/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { CommitStyle } from '../commit-style';
import { Dom } from '../../../dom';
import { isSuitElement } from './is-suit-element';
import type { Nullable } from '../../../../types';

/**
 * Finds the closest matching parent
 */
export function getClosestWrapper(
	style: CommitStyle,
	font: HTMLElement,
	root: HTMLElement
): Nullable<HTMLElement> {
	return Dom.closest(font, node => isSuitElement(style, node, true), root);
}
