/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:modules/widget/tabs/README.md]]
 * @packageDocumentation
 * @module modules/widget/tabs
 */

import type { IDictionary, IUIButton, IViewBased } from 'jodit/types';
import { Component } from 'jodit/core/component';
import { Dom } from 'jodit/core/dom/dom';
import { isFunction } from 'jodit/core/helpers/checker/is-function';
import { attr } from 'jodit/core/helpers/utils/attr';
import { Button, UIElement } from 'jodit/core/ui';

import './tabs.less';

export interface TabOption {
	icon?: string;
	name: string;
	content: HTMLElement | ((this: IViewBased) => void) | UIElement;
}

/**
 * Build tabs system
 *
 * @param tabs - PlainObject where 'key' will be tab's Title and `value` is tab's content
 * @param state - You can use for this param any HTML element for remembering active tab
 *
 * @example
 * ```javascript
 * const editor = Jodit.make('#editor');
 * const tabs = Jodit.modules.TabsWidget(editor, [
 *  { name: 'Images', content: '<div>Images</div>' },
 *  {
 *    name: 'Title 2',
 *    content: editor.c.fromHTML('<div>Some content</div>')
 *  },
 *  {
 *    name: 'Color Picker',
 *    content: ColorPickerWidget(
 *      editor,
 *      function (color) {
 *        box.style.color = color;
 *      },
 *      box.style.color
 *    )
 *  }
 * ]);
 * ```
 */
export const TabsWidget = (
	jodit: IViewBased,
	tabs: TabOption[],
	state?: { activeTab: string }
): HTMLDivElement => {
	const box = jodit.c.div('jodit-tabs');
	const tabBox = jodit.c.div('jodit-tabs__wrapper');

	const buttons = jodit.c.div('jodit-tabs__buttons');
	attr(buttons, {
		role: 'tablist',
		'aria-orientation': 'horizontal'
	});

	const nameToTab: IDictionary<{
		button: IUIButton;
		tab: HTMLElement;
	}> = {};
	const buttonList: IUIButton[] = [];

	let firstTab: string = '';

	box.appendChild(buttons);
	box.appendChild(tabBox);

	const setActive = (tab: string): void => {
		if (!nameToTab[tab]) {
			return;
		}

		buttonList.forEach(b => {
			b.state.activated = false;
		});

		Object.values(nameToTab).forEach(({ tab }) =>
			tab.classList.remove('jodit-tab_active')
		);

		nameToTab[tab].button.state.activated = true;
		nameToTab[tab].tab.classList.add('jodit-tab_active');
	};

	tabs.forEach(({ icon, name, content }) => {
		const tab = jodit.c.div('jodit-tab');
		attr(tab, {
			role: 'tabpanel'
		});

		const button = Button(jodit, icon || name, name);
		button.state.role = 'tab';

		// Stop lose the focus
		jodit.e.on(button.container, 'pointerdown', (e: MouseEvent) =>
			e.preventDefault()
		);

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
				Component.isInstanceOf(content, UIElement)
					? content.container
					: content
			);
		} else {
			tab.appendChild(jodit.c.div('jodit-tab_empty'));
		}

		tabBox.appendChild(tab);

		button.onAction(() => {
			setActive(name);

			if (isFunction(content) && !Dom.isElement(content)) {
				content.call(jodit);
			}

			if (state) {
				state.activeTab = name;
			}

			return false;
		});

		nameToTab[name] = {
			button,
			tab
		};
	});

	Object.values(nameToTab).forEach(({ button }) => {
		button.container.style.width = (100 / tabs.length).toFixed(10) + '%';
	});

	const tab =
		!state || !state.activeTab || !nameToTab[state.activeTab]
			? firstTab
			: state.activeTab;

	setActive(tab);

	if (state) {
		let activeTab = state.activeTab;

		Object.defineProperty(state, 'activeTab', {
			configurable: true,
			enumerable: false,
			get() {
				return activeTab;
			},
			set(value: string) {
				activeTab = value;

				setActive(value);
			}
		});
	}

	return box;
};
