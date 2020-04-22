/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
import './context-menu.less';

import { IContextMenu, IContextMenuAction } from '../../types';
import { Icon } from '../../core/ui';
import { Popup } from '../../core/ui/popup';

/**
 * Module to generate context menu
 *
 * @module ContextMenu
 * @param {Object} parent Jodit main object
 */
export class ContextMenu extends Popup implements IContextMenu {
	/**
	 * Generate and show context menu
	 *
	 * @param x Global coordinate by X
	 * @param y Global coordinate by Y
	 * @param actions Array with plain objects {icon: 'bin', title: 'Delete', exec: function () { do smth}}
	 * @example
	 * ```javascript
	 * parent.show(e.clientX, e.clientY, [{icon: 'bin', title: 'Delete', exec: function () { alert(1) }]);
	 * ```
	 */
	show(x: number, y: number, actions: Array<false | IContextMenuAction>) {
		const self = this,
			content = this.j.c.div('jodit-context-menu__actions');

		if (!Array.isArray(actions)) {
			return;
		}

		actions.forEach(item => {
			if (!item) {
				return;
			}

			const title = self.j.i18n(item.title || '');

			const action = this.j.c.fromHTML(
				`<a title="${title}" data-icon="${item.icon}"  href="javascript:void(0)">` +
					(item.icon ? Icon.get(item.icon) : '') +
					'<span></span></a>'
			) as HTMLAnchorElement;

			const span = action.querySelector('span') as HTMLSpanElement;

			this.j.e.on(action, 'click', (e: MouseEvent) => {
				item.exec?.call(self, e);
				self.close();
				return false;
			});

			span.textContent = title;
			content.appendChild(action);
		});

		super
			.setContent(content)
			.open(() => ({ left: x, top: y, width: 0, height: 0 }), true);
	}
}
