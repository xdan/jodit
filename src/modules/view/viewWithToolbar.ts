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

	protected makeToolbar(container: HTMLElement) {
		if (!this.options.toolbar) {
			return;
		}

		let toolbarContainer: HTMLElement = this.create.div(
			'jodit_toolbar_container'
		);
		container.appendChild(toolbarContainer);

		if (
			this.options.toolbar instanceof HTMLElement ||
			typeof this.options.toolbar === 'string'
		) {
			toolbarContainer = this.resolveElement(this.options.toolbar);
		}

		this.applyOptionsToToolbarContainer(toolbarContainer);

		this.toolbar.build(
			splitArray(this.options.buttons).concat(this.options.extraButtons),
			toolbarContainer
		);

		const bs = (this.options.toolbarButtonSize || 'middle').toLowerCase();

		toolbarContainer.classList.add(
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
		this.setStatus('beforeDestruct');
		this.toolbar.destruct();
		delete this.toolbar;
		super.destruct();
	}
}

import { JoditToolbarCollection } from '../toolbar/joditToolbarCollection';
import { splitArray } from '../helpers/array';
