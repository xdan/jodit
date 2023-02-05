/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/key-arrow-outside/README.md]]
 * @packageDocumentation
 * @module plugins/key-arrow-outside
 */

import type { IJodit } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { watch } from 'jodit/core/decorators';
import { KEY_RIGHT, NBSP_SPACE } from 'jodit/core/constants';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';

/**
 * Allowing to go outside of an inline element if there is no other element after that.
 */
export class keyArrowOutside extends Plugin {
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
				!Dom.findNotEmptyNeighbor(parentNode, false, this.j.editor)
			) {
				Dom.after(parentNode, this.j.createInside.text(NBSP_SPACE));
			}
		}
	}
}

pluginSystem.add('keyArrowOutside', keyArrowOutside);
