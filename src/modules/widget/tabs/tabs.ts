import './tabs.less';
import { IDictionary, IJodit } from '../../../types';
import { $$, each } from '../../../core/helpers';

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
	tabs: IDictionary<(() => void) | HTMLElement>,
	state?: { __activeTab: string }
): HTMLDivElement => {
	const box: HTMLDivElement = editor.c.div('jodit_tabs'),
		tabBox: HTMLDivElement = editor.c.div('jodit_tabs_wrapper'),
		buttons: HTMLDivElement = editor.c.div('jodit_tabs_buttons'),
		nameToTab: IDictionary<{
			button: HTMLElement;
			tab: HTMLElement;
		}> = {};

	let firstTab: string = '',
		tabcount: number = 0;

	box.appendChild(buttons);
	box.appendChild(tabBox);

	each<(() => void) | HTMLElement>(tabs, (name: string, tabOptions) => {
		const tab = editor.c.div('jodit_tab'),
			button = editor.c.element('a', {
				href: 'javascript:void(0);'
			});

		if (!firstTab) {
			firstTab = name.toString();
		}

		button.innerHTML = /<svg/.test(name.toString())
			? name
			: editor.i18n(name.toString());
		buttons.appendChild(button);

		if (typeof tabOptions !== 'function') {
			tab.appendChild(tabOptions);
		} else {
			tab.appendChild(editor.c.div('jodit_tab_empty'));
		}

		tabBox.appendChild(tab);

		editor.e.on(button, 'mousedown touchend', (e: MouseEvent) => {
			$$('a', buttons).forEach(a => {
				a.classList.remove('active');
			});
			$$('.jodit_tab', tabBox).forEach(a => {
				a.classList.remove('active');
			});

			button.classList.add('active');
			tab.classList.add('active');

			if (typeof tabOptions === 'function') {
				tabOptions.call(editor);
			}

			e.stopPropagation();

			if (state) {
				state.__activeTab = name.toString();
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

	if (!state || !state.__activeTab || !nameToTab[state.__activeTab]) {
		nameToTab[firstTab].button.classList.add('active');
		nameToTab[firstTab].tab.classList.add('active');
	} else {
		nameToTab[state.__activeTab].button.classList.add('active');
		nameToTab[state.__activeTab].tab.classList.add('active');
	}

	return box;
};
