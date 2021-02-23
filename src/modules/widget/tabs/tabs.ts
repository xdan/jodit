/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './tabs.less';

import type { IDictionary, IJodit, IUIButton } from '../../../types';
import { $$, isFunction } from '../../../core/helpers';
import { Button } from '../../../core/ui';

export interface TabOption {
	icon?: string;
	name: string;
	content: HTMLElement | (() => void);
}

/**
 * Build tabs system
 *
 * @param {Jodit} editor
 * @param {object} tabs PlainObject where 'key' will be tab's Title and `value` is tab's content
 * @param {object} state You can use for this param any HTML element for remembering active tab
 * @param {string} state.activeTab
 *
 * @example
 * ```javascript
 * let tabs = widget.c('Tabs', {
 *    'Images': '<div>Images</div>',
 *    'Title 2': Jodit.modules.Helpers.dom('<div>Some content</div>'),
 *    'Color Picker': ColorPickerWidget(editor, function (color) {
 *         box.style.color = color;
 *     }, box.style.color),
 * });
 * ```
 */
export const TabsWidget = (
	editor: IJodit,
	tabs: TabOption[],
	state?: { __activeTab: string }
): HTMLDivElement => {
	const box: HTMLDivElement = editor.c.div('jodit-tabs'),
		tabBox: HTMLDivElement = editor.c.div('jodit-tabs__wrapper'),
		buttons: HTMLDivElement = editor.c.div('jodit-tabs__buttons'),
		nameToTab: IDictionary<{
			button: IUIButton;
			tab: HTMLElement;
		}> = {},
		buttonList: IUIButton[] = [];

	let firstTab: string = '',
		tabcount: number = 0;

	box.appendChild(buttons);
	box.appendChild(tabBox);

	tabs.forEach(({ icon, name, content }) => {
		const tab = editor.c.div('jodit-tab'),
			button = Button(editor, icon || name, name);

		if (!firstTab) {
			firstTab = name;
		}

		buttons.appendChild(button.container);
		buttonList.push(button);

		button.container.classList.add(
			'jodit-tabs__button',
			'jodit-tabs__button_columns_' + tabs.length
		);

		if (!isFunction(content)) {
			tab.appendChild(content);
		} else {
			tab.appendChild(editor.c.div('jodit-tab_empty'));
		}

		tabBox.appendChild(tab);

		button.onAction(() => {
			buttonList.forEach(b => {
				b.state.activated = false;
			});

			$$('.jodit-tab', tabBox).forEach(a => {
				a.classList.remove('jodit-tab_active');
			});

			button.state.activated = true;
			tab.classList.add('jodit-tab_active');

			if (isFunction(content)) {
				content.call(editor);
			}

			if (state) {
				state.__activeTab = name;
			}

			return false;
		});

		nameToTab[name] = {
			button,
			tab
		};

		tabcount += 1;
	});

	if (!tabcount) {
		return box;
	}

	$$('a', buttons).forEach(a => {
		a.style.width = (100 / tabcount).toFixed(10) + '%';
	});

	const tab =
		!state || !state.__activeTab || !nameToTab[state.__activeTab]
			? firstTab
			: state.__activeTab;

	nameToTab[tab].button.state.activated = true;
	nameToTab[tab].tab.classList.add('jodit-tab_active');

	return box;
};
