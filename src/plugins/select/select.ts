/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/select
 */

import type { IJodit, Nullable } from 'jodit/types';
import { Plugin } from 'jodit/core/plugin';
import { autobind, watch } from 'jodit/core/decorators';
import { camelCase } from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';
import { Popup, UIElement } from 'jodit/core/ui';

/* eslint-disable tsdoc/syntax */

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

	/** @override */
	protected afterInit(jodit: IJodit): void {
		this.proxyEventsList.forEach(eventName => {
			jodit.e.on(eventName + '.select', this.onStartSelection);
		});
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		this.proxyEventsList.forEach(eventName => {
			jodit.e.on(eventName + '.select', this.onStartSelection);
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
	 * @event outsideClick(e) - when user clicked in the outside of editor
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
