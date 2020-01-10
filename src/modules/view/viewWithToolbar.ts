/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewWithToolbar } from '../../types/view';
import { View } from './view';
import { JoditToolbarCollection } from '../toolbar/joditToolbarCollection';
import { splitArray } from '../helpers/array';
import { STATUSES } from '../Component';
import { Dom } from '../Dom';

export class ViewWithToolbar extends View implements IViewWithToolbar {
	toolbar = JoditToolbarCollection.makeCollection(this);

	/**
	 * Change panel container
	 * @param element
	 */
	setPanel(element: HTMLElement | string): void {
		this.jodit.options.toolbar = element;
		this.makeToolbar(this.container);
	}

	private toolbarContainer: HTMLElement;

	protected makeToolbar(container: HTMLElement) {
		if (!this.options.toolbar) {
			return;
		}

		if (!this.toolbarContainer) {
			this.toolbarContainer = this.create.div(
				'jodit_toolbar_container'
			);
		}

		if (
			this.options.toolbar instanceof HTMLElement ||
			typeof this.options.toolbar === 'string'
		) {
			this.toolbarContainer = this.resolveElement(this.options.toolbar);
		} else {
			Dom.appendChildFirst(container, this.toolbarContainer);
		}

		this.applyOptionsToToolbarContainer(this.toolbarContainer);

		this.toolbar.build(
			splitArray(this.options.buttons).concat(this.options.extraButtons),
			this.toolbarContainer
		);

		const bs = (this.options.toolbarButtonSize || 'middle').toLowerCase();

		this.toolbarContainer.classList.add(
			'jodit_toolbar_size-' +
			(['middle', 'large', 'small'].indexOf(bs) !== -1
				? bs
				: 'middle')
		);
	}

	protected applyOptionsToToolbarContainer(element: HTMLElement) {
		element.classList.add(
			'jodit_' + (this.options.theme || 'default') + '_theme'
		);

		element.classList.toggle('jodit_text_icons', this.options.textIcons);

		if (this.options.zIndex) {
			element.style.zIndex = parseInt(
				this.options.zIndex.toString(),
				10
			).toString();
		}
	}

	destruct() {
		this.setStatus(STATUSES.beforeDestruct);
		this.toolbar.destruct();
		delete this.toolbar;
		super.destruct();
	}
}

