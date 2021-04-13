/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, Nullable } from '../types';
import { Plugin } from '../core/plugin';
import { autobind, watch } from '../core/decorators';
import { camelCase } from '../core/helpers';
import { Dom } from '../core/dom';
import { Popup, UIElement } from '../core/ui';

/**
 * A utility plugin that allows you to subscribe to a click/mousedown/touchstart/mouseup on an element in DOM order
 *
 * @example
 * ```js
 * const editor = Jodit.make('#editor');
 * editor.e.on('clickImg', (img) => {
 *   console.log(img.src);
 * })
 * ```
 */
export class select extends Plugin {
	private proxyEventsList = [
		'click',
		'mousedown',
		'touchstart',
		'mouseup',
		'touchend'
	];

	protected afterInit(jodit: IJodit): void {
		this.proxyEventsList.forEach(eventName => {
			jodit.e.on(eventName + '.inline-popup', this.onStartSelection);
		});
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		this.proxyEventsList.forEach(eventName => {
			jodit.e.on(eventName + '.inline-popup', this.onStartSelection);
		});
	}

	@autobind
	private onStartSelection(e: MouseEvent) {
		const { j } = this;

		let result,
			target = e.target as Nullable<Node>;

		while (result === undefined && target && target !== j.editor) {
			result = j.e.fire(
				camelCase(e.type + '_' + target.nodeName.toLowerCase()),
				target,
				e
			);

			target = target.parentElement;
		}

		if (e.type === 'click' && result === undefined && target === j.editor) {
			j.e.fire(e.type + 'Editor', target, e);
		}
	}

	/**
	 *
	 * @param e
	 * @emits outsideClick(e) - when user clicked in the outside of editor
	 */
	@watch('ow:click')
	protected onOutsideClick(e: MouseEvent): void {
		const node = e.target as Node;

		if (Dom.up(node, elm => elm === this.j.editor)) {
			return;
		}

		const box = UIElement.closestElement(node, Popup);

		if (!box) {
			this.j.e.fire('outsideClick', e);
		}
	}
}
