/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import type { IJodit } from '../../types';
import { Plugin } from '../../core/plugin';
import { watch } from '../../core/decorators';
import { KEY_RIGHT, NBSP_SPACE } from '../../core/constants';
import { Dom } from '../../core/dom';
import { findNotEmptyNeighbor } from './helpers';

/**
 * Allowing to go outside of an inline element if there is no other element after that.
 */
export class KeyArrowOutside extends Plugin {
	protected afterInit(jodit: IJodit): void {}

	protected beforeDestruct(jodit: IJodit): void {}

	@watch(':keydown')
	protected onKeyDownArrow(e: KeyboardEvent): void {
		if (e.key !== KEY_RIGHT || !this.j.selection.isCollapsed()) {
			return;
		}

		const { endContainer, endOffset } = this.j.selection.range;

		if (!Dom.isText(endContainer)) {
			return;
		}

		if (endContainer.nodeValue?.length === endOffset) {
			const { parentNode } = endContainer;

			if (
				Dom.isInlineBlock(parentNode) &&
				!findNotEmptyNeighbor(parentNode, false, this.j.editor)
			) {
				Dom.after(parentNode, this.j.createInside.text(NBSP_SPACE));
			}
		}
	}
}
