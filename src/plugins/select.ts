/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IJodit, Nullable } from '../types';
import { Plugin } from '../core/plugin';
import { autobind } from '../core/decorators';
import { camelCase } from '../core/helpers';

/**
 * A utility plugin that allows you to subscribe to a click on an element in DOM order
 *
 * @example
 * ```js
 * const editor = Jodit.make('#editor');
 * editor.e.on('clickElementImg', (img) => {
 *   console.log(img.src);
 * })
 * ```
 */
export class select extends Plugin {
	protected afterInit(jodit: IJodit): void {
		jodit.e.on(
			'mousedown.inline-popup touchstart.inline-popup',
			this.onStartSelection
		);
	}

	/** @override */
	protected beforeDestruct(jodit: IJodit): void {
		jodit.e.off(
			'mousedown.inline-popup touchstart.inline-popup',
			this.onStartSelection
		);
	}

	@autobind
	private onStartSelection(e: MouseEvent) {
		let result,
			target = e.target as Nullable<Node>;

		while (result === undefined && target && target !== this.j.editor) {
			result = this.j.e.fire(
				camelCase('clickElement_' + target.nodeName.toLowerCase()),
				target,
				e
			);

			target = target.parentElement;
		}
	}
}
