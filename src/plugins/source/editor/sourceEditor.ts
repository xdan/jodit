/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/source
 */

import type { CallbackFunction, IJodit } from 'jodit/types';

export abstract class SourceEditor<T> {
	instance!: T;
	className: string = '';

	constructor(
		readonly jodit: IJodit,
		readonly container: HTMLElement,
		readonly toWYSIWYG: CallbackFunction,
		readonly fromWYSIWYG: CallbackFunction
	) {}

	/**
	 * Short alias for this.jodit
	 */
	get j(): this['jodit'] {
		return this.jodit;
	}

	abstract init(editor: IJodit): void;
	abstract replaceUndoManager(): void;

	isReady: boolean = false;
	protected onReady(): void {
		this.replaceUndoManager();
		this.isReady = true;
		this.j.e.fire(this, 'ready');
	}

	onReadyAlways(onReady: CallbackFunction): void {
		if (!this.isReady) {
			this.j.events?.on(this, 'ready', onReady);
		} else {
			onReady();
		}
	}
}
