/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import autobind from 'autobind-decorator';

import { Plugin } from '../../core/plugin';
import { IJodit, markerInfo, Nullable } from '../../types';
import { Dom } from '../../core/dom';
import { isString } from '../../core/helpers/checker';

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
	 * @private
	 */
	@autobind
	private postProcessSetEditorValue() {
		const { jodit } = this;

		if (!jodit.isEditorMode()) {
			return;
		}

		let child: Nullable<Node> = jodit.editor.firstChild,
			isChanged: boolean = false;

		let selInfo: Nullable<markerInfo[]> = null;

		while (child) {
			if (this.isSuitableStart(child)) {
				if (!isChanged) {
					selInfo = jodit.s.save();
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
			jodit.s.restore(selInfo);

			if (jodit.e.current === 'afterInit') {
				jodit.e.fire('internalChange');
			}
		}
	}

	/**
	 * Found Node which should be wrapped
	 * @param n
	 */
	private isSuitableStart = (n: Nullable<Node>): boolean =>
		(Dom.isText(n) && isString(n.nodeValue) && /[^\s]/.test(n.nodeValue)) ||
		(this.isNotClosed(n) && !this.jodit.selection.isMarker(n));

	/**
	 * Node should add in block element
	 * @param n
	 */
	private isSuitable = (n: Nullable<Node>): boolean =>
		Dom.isText(n) || this.isNotClosed(n);

	/**
	 * Some element which need append in block
	 * @param n
	 */
	private isNotClosed = (n: Nullable<Node>): n is Element =>
		Dom.isElement(n) &&
		!(Dom.isBlock(n, this.jodit.ew) || Dom.isTag(n, ['hr']));
}
