/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewWithToolbar } from '../../types/view';
import { View } from './view';
import { splitArray } from '../../core/helpers/array';
import { STATUSES } from '../component';
import { Dom } from '../dom';
import { Buttons, IToolbarCollection } from '../../types';
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
			'.jodit_toolbar_container'
		);

		if (!toolbarContainer) {
			toolbarContainer = this.create.div(
				'jodit_toolbar_container'
			);

			Dom.appendChildFirst(container, toolbarContainer);
		}

		if (
			Dom.isHTMLElement(this.options.toolbar, this.jodit.ownerWindow) ||
			typeof this.options.toolbar === 'string'
		) {
			toolbarContainer = this.resolveElement(this.options.toolbar);
		}

		const buttons = splitArray(this.options.buttons) as Buttons;

		this.toolbar.build(
			buttons.concat(this.options.extraButtons),
			toolbarContainer
		);
	}

	destruct() {
		this.setStatus(STATUSES.beforeDestruct);
		this.toolbar.destruct();
		delete this.__toolbar;
		super.destruct();
	}
}
