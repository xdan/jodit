/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IViewBased } from '../types/view';
import { Component, STATUSES } from './Component';
import { css } from './helpers/css';
import { ToolbarIcon } from './toolbar/icon';
import { Dom } from './Dom';
import { IContextMenu, IContextMenuAction } from '../types';

/**
 * Module to generate context menu
 *
 * @module ContextMenu
 * @param {Object} parent Jodit main object
 */
export class ContextMenu extends Component implements IContextMenu {
	private context: HTMLElement;
	private evnts = 'mousedown jodit_close_dialog scroll';

	/**
	 * Hide context menu
	 *
	 * @method hide
	 */
	hide = () => {
		Dom.safeRemove(this.context);
		this.jodit.events.off(this.jodit.ownerWindow, this.evnts, this.hide);
	};

	/**
	 * Generate and show context menu
	 *
	 * @method show
	 * @param {number} x Global coordinate by X
	 * @param {number} y Global coordinate by Y
	 * @param {Action[]} actions Array with plainobjects {icon: 'bin', title: 'Delete', exec: function () { do smth}}
	 * @param {number} zIndex
	 * @example
	 * ```javascript
	 * parent.show(e.clientX, e.clientY, [{icon: 'bin', title: 'Delete', exec: function () { alert(1) }]);
	 * ```
	 */
	show(
		x: number,
		y: number,
		actions: Array<false | IContextMenuAction>,
		zIndex?: number
	) {
		const self = this;

		if (!Array.isArray(actions)) {
			return;
		}

		if (zIndex) {
			this.context.style.zIndex = zIndex.toString();
		}

		Dom.detach(this.context);

		actions.forEach(item => {
			if (!item) {
				return;
			}

			const title = self.jodit.i18n(item.title || '');

			const action = this.jodit.create.fromHTML(
				`<a title="${title}" data-icon="${item.icon}"  href="javascript:void(0)">` +
					(item.icon ? ToolbarIcon.getIcon(item.icon) : '') +
					'<span></span></a>'
			) as HTMLAnchorElement;

			const span = action.querySelector('span') as HTMLSpanElement;

			action.addEventListener('mousedown', (e: MouseEvent) => {
				item.exec?.call(self, e);
				self.hide();
				return false;
			});

			span.textContent = title;
			self.context.appendChild(action);
		});

		css(self.context, {
			left: x,
			top: y
		});

		this.jodit.events.on(this.jodit.ownerWindow, this.evnts, self.hide);

		this.jodit.markOwner(this.context);

		this.jodit?.ownerDocument.body.appendChild(this.context);
	}

	constructor(editor: IViewBased) {
		super(editor);

		this.context = editor.create.div('jodit_context_menu');
		this.context.classList.add('jodit_context_menu-show');
	}

	destruct() {
		if (this.isInDestruct) {
			return;
		}

		this.setStatus(STATUSES.beforeDestruct);
		Dom.safeRemove(this.context);
		delete this.context;

		this.jodit.events.off(this.jodit.ownerWindow, this.evnts, this.hide);
		super.destruct();
	}
}
