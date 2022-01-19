/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/fix
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { Dom } from 'jodit/core/dom';
import { isString } from 'jodit/core/helpers/checker';
import { autobind } from 'jodit/core/decorators';

/**
 * Wrap single text nodes in block wrapper
 */
export class WrapTextNodes extends Plugin {
	/** @override **/
	protected afterInit(jodit: IJodit): void {
		if (jodit.o.enter.toLowerCase() === 'br') {
			return;
		}

		jodit.e.on(
			'afterInit.wtn postProcessSetEditorValue.wtn',
			this.postProcessSetEditorValue
		);
	}

	/** @override **/
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off('.wtn');
	}

	/**
	 * Process changed value
	 */
	@autobind
	private postProcessSetEditorValue() {
		const { jodit } = this;

		if (!jodit.isEditorMode()) {
			return;
		}

		let child: Nullable<Node> = jodit.editor.firstChild,
			isChanged: boolean = false;

		while (child) {
			if (this.isSuitableStart(child)) {
				if (!isChanged) {
					jodit.s.save();
				}

				isChanged = true;
				const box = jodit.createInside.element(jodit.o.enter);

				Dom.before(child, box);

				while (child && this.isSuitable(child)) {
					const next: Nullable<Node> = child.nextSibling;
					box.appendChild(child);
					child = next;
				}

				box.normalize();
			}

			child = child && child.nextSibling;
		}

		if (isChanged) {
			jodit.s.restore();

			if (jodit.e.current === 'afterInit') {
				jodit.e.fire('internalChange');
			}
		}
	}

	/**
	 * Found Node which should be wrapped
	 */
	private isSuitableStart = (n: Nullable<Node>): boolean =>
		(Dom.isText(n) && isString(n.nodeValue) && /[^\s]/.test(n.nodeValue)) ||
		(this.isNotClosed(n) && !Dom.isTemporary(n));

	/**
	 * Node should add in block element
	 */
	private isSuitable = (n: Nullable<Node>): boolean =>
		Dom.isText(n) || this.isNotClosed(n);

	/**
	 * Some element which need append in block
	 */
	private isNotClosed = (n: Nullable<Node>): n is Element =>
		Dom.isElement(n) && !(Dom.isBlock(n) || Dom.isTag(n, ['hr', 'style']));
}
