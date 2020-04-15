/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewWithToolbar, Buttons, IToolbarCollection } from '../../types/';
import { View } from './view';
import { splitArray, isString } from '../../core/helpers/';
import { STATUSES } from '../component';
import { Dom } from '../dom';
import { makeCollection } from '../toolbar/factory';

export class ViewWithToolbar extends View implements IViewWithToolbar {
	private __toolbar = makeCollection(this);

	get toolbar(): IToolbarCollection {
		return this.__toolbar;
	}

	/**
	 * Change panel container
	 * @param element
	 */
	setPanel(element: HTMLElement | string): void {
		this.jodit.options.toolbar = element;
		this.buildToolbar(this.container);
	}

	protected buildToolbar(container: HTMLElement) {
		if (!this.options.toolbar) {
			return;
		}

		let toolbarContainer: HTMLElement | null = container.querySelector(
			'.jodit__toolbar-box'
		);

		if (!toolbarContainer) {
			toolbarContainer = this.create.div('jodit__toolbar-box');

			Dom.appendChildFirst(container, toolbarContainer);
		}

		if (
			Dom.isHTMLElement(this.options.toolbar, this.jodit.ownerWindow) ||
			isString(this.options.toolbar)
		) {
			toolbarContainer = this.resolveElement(this.options.toolbar);
		}

		const buttons = splitArray(this.options.buttons) as Buttons;

		this.toolbar
			.build(buttons.concat(this.options.extraButtons))
			.appendTo(toolbarContainer);
	}

	destruct() {
		this.setStatus(STATUSES.beforeDestruct);
		this.toolbar.destruct();
		delete this.__toolbar;
		super.destruct();
	}
}
