/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewWithToolbar, Buttons, IToolbarCollection } from '../../types/';
import { View } from './view';
import { splitArray, isString } from '../../core/helpers/';
import { STATUSES } from '../../core/component';
import { Dom } from '../../core/dom';
import { makeCollection } from '../toolbar/factory';

export abstract class ViewWithToolbar extends View implements IViewWithToolbar {
	private __toolbar = makeCollection(this);

	get toolbar(): IToolbarCollection {
		return this.__toolbar;
	}

	/**
	 * Change panel container
	 * @param element
	 */
	setPanel(element: HTMLElement | string): void {
		this.j.o.toolbar = element;
		this.buildToolbar(this.container);
	}

	protected buildToolbar(container: HTMLElement) {
		if (!this.o.toolbar) {
			return;
		}

		let toolbarContainer: HTMLElement | null = container.querySelector(
			'.jodit__toolbar-box'
		);

		if (!toolbarContainer) {
			toolbarContainer = this.c.div('jodit__toolbar-box');

			Dom.appendChildFirst(container, toolbarContainer);
		}

		if (
			Dom.isHTMLElement(this.o.toolbar, this.j.ow) ||
			isString(this.o.toolbar)
		) {
			toolbarContainer = this.resolveElement(this.o.toolbar);
		}

		const buttons = splitArray(this.o.buttons) as Buttons;

		this.toolbar
			.build(buttons.concat(this.o.extraButtons))
			.appendTo(toolbarContainer);
	}

	destruct() {
		this.setStatus(STATUSES.beforeDestruct);
		this.toolbar.destruct();
		delete this.__toolbar;
		super.destruct();
	}
}
