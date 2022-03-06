/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/widget/tabs/README.md]]
 * @packageDocumentation
 * @module modules/widget/tabs
 */

import './tabs.less';

import type { IDictionary, IJodit, IUIButton } from 'jodit/types';
import { $$, isFunction } from 'jodit/core/helpers';
import { Button, UIElement } from 'jodit/core/ui';

export interface TabOption {
	icon?: string;
	name: string;
	content: HTMLElement | (() => void) | UIElement;
}

/**
 * Build tabs system
 *
 * @param tabs - PlainObject where 'key' will be tab's Title and `value` is tab's content
 * @param state - You can use for this param any HTML element for remembering active tab
 *
 * @example
 * ```javascript
 * let tabs = Jodit.modules.TabsWidget(editor, [
 *    {name: 'Images', content: '<div>Images</div>'},
 *    {name: 'Title 2': Jodit.modules.Helpers.dom('<div>Some content</div>')},
 *    {name: 'Color Picker': ColorPickerWidget(editor, function (color) {
 *         box.style.color = color;
 *     }, box.style.color)},
 * ]);
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

	const setActive = (tab: string): void => {
		if (!nameToTab[tab]) {
			return;
		}

		buttonList.forEach(b => {
			b.state.activated = false;
		});

		$$('.jodit-tab', tabBox).forEach(a => {
			a.classList.remove('jodit-tab_active');
		});

		nameToTab[tab].button.state.activated = true;
		nameToTab[tab].tab.classList.add('jodit-tab_active');
	};

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
			tab.appendChild(
				content instanceof UIElement ? content.container : content
			);
		} else {
			tab.appendChild(editor.c.div('jodit-tab_empty'));
		}

		tabBox.appendChild(tab);

		button.onAction(() => {
			setActive(name);

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

	setActive(tab);

	if (state) {
		let __activeTab = state.__activeTab;
		Object.defineProperty(state, '__activeTab', {
			get() {
				return __activeTab;
			},
			set(value: string) {
				__activeTab = value;

				setActive(value);
			}
		});
	}

	return box;
};
