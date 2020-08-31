/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './view-with-toolbar.less';

import { IViewWithToolbar, IToolbarCollection, Buttons } from '../../types';
import { View } from './view';
import { isString, resolveElement, splitArray } from '../helpers';
import { Dom } from '../dom';
import { makeCollection } from '../../modules/toolbar/factory';
import { STATUSES } from '../component';

export abstract class ViewWithToolbar extends View implements IViewWithToolbar {
	toolbar: IToolbarCollection = makeCollection(this);

	private defaultToolbarContainer: HTMLElement = this.c.div(
		'jodit-toolbar__box'
	);

	/**
	 * Container for toolbar
	 */
	get toolbarContainer(): HTMLElement {
		if (
			!this.o.fullsize &&
			(isString(this.o.toolbar) ||
				Dom.isHTMLElement(this.o.toolbar, this.ow))
		) {
			return resolveElement(this.o.toolbar, this.o.shadowRoot || this.od);
		}

		this.o.toolbar &&
			Dom.appendChildFirst(this.container, this.defaultToolbarContainer);

		return this.defaultToolbarContainer;
	}

	/**
	 * Change panel container
	 * @param element
	 */
	setPanel(element: HTMLElement | string): void {
		this.o.toolbar = element;
		this.buildToolbar();
	}

	/**
	 * Helper for append toolbar in its place
	 */
	protected buildToolbar(): void {
		if (!this.o.toolbar) {
			return;
		}

		const buttons = this.o.buttons
			? (splitArray(this.o.buttons) as Buttons)
			: [];

		this.toolbar
			.setRemoveButtons(this.o.removeButtons)
			.build(buttons.concat(this.o.extraButtons || []))
			.appendTo(this.toolbarContainer);
	}

	destruct(): void {
		if (this.isDestructed) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);
		this.toolbar.destruct();
		super.destruct();
	}
}
