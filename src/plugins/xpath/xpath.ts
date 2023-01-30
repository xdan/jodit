/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/xpath/README.md]]
 * @packageDocumentation
 * @module plugins/xpath
 */

import './xpath.less';

import type { IControlTypeStrong, IToolbarButton } from 'jodit/types';
import { INVISIBLE_SPACE, MODE_WYSIWYG } from 'jodit/core/constants';
import { ContextMenu } from 'jodit/modules/context-menu/context-menu';
import { Dom } from 'jodit/core/dom';
import { getXPathByElement, trim, attr } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin';
import { makeButton } from 'jodit/modules/toolbar/factory';
import { pluginSystem } from 'jodit/core/global';

import './config';

/**
 * Show path to current element in status bar
 */
class xpath extends Plugin {
	private __onContext = (bindElement: Node, event: MouseEvent): boolean => {
		if (!this.menu) {
			this.menu = new ContextMenu(this.j);
		}

		this.menu.show(event.clientX, event.clientY, [
			{
				icon: 'bin',
				title: bindElement === this.j.editor ? 'Clear' : 'Remove',
				exec: (): void => {
					if (bindElement !== this.j.editor) {
						Dom.safeRemove(bindElement);
					} else {
						this.j.value = '';
					}
					this.j.synchronizeValues();
				}
			},
			{
				icon: 'select-all',
				title: 'Select',
				exec: (): void => {
					this.j.s.select(bindElement);
				}
			}
		]);

		return false;
	};

	private __onSelectPath = (
		bindElement: Node,
		event: MouseEvent
	): boolean => {
		this.j.s.focus();

		const path = attr(event.target as HTMLElement, '-path') || '/';

		if (path === '/') {
			this.j.execCommand('selectall');
			return false;
		}

		try {
			const elm: Node | null = this.j.ed
				.evaluate(path, this.j.editor, null, XPathResult.ANY_TYPE, null)
				.iterateNext();

			if (elm) {
				this.j.s.select(elm);
				return false;
			}
		} catch {}

		this.j.s.select(bindElement);

		return false;
	};

	private __tpl = (
		bindElement: Node,
		path: string,
		name: string,
		title: string
	): HTMLElement => {
		const item = this.j.c.fromHTML(
			`<span class="jodit-xpath__item"><a role="button" data-path="${path}" title="${title}" tabindex="-1"'>${trim(
				name
			)}</a></span>`
		) as HTMLLIElement;

		const a = item.firstChild as HTMLAnchorElement;

		this.j.e
			.on(a, 'click', this.__onSelectPath.bind(this, bindElement))
			.on(a, 'contextmenu', this.__onContext.bind(this, bindElement));

		return item;
	};

	private __selectAllButton?: IToolbarButton;

	private __removeSelectAll = (): void => {
		if (this.__selectAllButton) {
			this.__selectAllButton.destruct();
			delete this.__selectAllButton;
		}
	};

	private __appendSelectAll = (): void => {
		this.__removeSelectAll();

		this.__selectAllButton = makeButton(this.j, {
			name: 'selectall',
			...this.j.o.controls.selectall
		} as IControlTypeStrong);

		this.__selectAllButton.state.size = 'tiny';

		this.container &&
			this.container.insertBefore(
				this.__selectAllButton.container,
				this.container.firstChild
			);
	};

	private __calcPathImd = (): void => {
		if (this.isDestructed) {
			return;
		}

		const current = this.j.s.current();

		if (this.container) {
			this.container.innerHTML = INVISIBLE_SPACE;
		}

		if (current) {
			let name: string, xpth: string, li: HTMLElement;

			Dom.up(
				current,
				(elm: Node | null) => {
					if (elm && this.j.editor !== elm && !Dom.isText(elm)) {
						name = elm.nodeName.toLowerCase();
						xpth = getXPathByElement(
							elm as HTMLElement,
							this.j.editor
						).replace(/^\//, '');
						li = this.__tpl(
							elm,
							xpth,
							name,
							this.j.i18n('Select %s', name)
						);

						this.container &&
							this.container.insertBefore(
								li,
								this.container.firstChild
							);
					}
				},
				this.j.editor
			);
		}

		this.__appendSelectAll();
	};

	private __calcPath: () => void = this.j.async.debounce(
		this.__calcPathImd,
		this.j.defaultTimeout * 2
	);

	protected container?: HTMLElement;
	protected menu?: ContextMenu;

	protected afterInit(): void {
		if (this.j.o.showXPathInStatusbar) {
			this.container = this.j.c.div('jodit-xpath');

			this.j.e
				.off('.xpath')
				.on(
					'mouseup.xpath change.xpath keydown.xpath changeSelection.xpath',
					this.__calcPath
				)
				.on(
					'afterSetMode.xpath afterInit.xpath changePlace.xpath',
					() => {
						if (!this.j.o.showXPathInStatusbar || !this.container) {
							return;
						}

						this.j.statusbar.append(this.container);

						if (this.j.getRealMode() === MODE_WYSIWYG) {
							this.__calcPath();
						} else {
							if (this.container) {
								this.container.innerHTML = INVISIBLE_SPACE;
							}
							this.__appendSelectAll();
						}
					}
				);

			this.__calcPath();
		}
	}

	protected beforeDestruct(): void {
		if (this.j && this.j.events) {
			this.j.e.off('.xpath');
		}

		this.__removeSelectAll();

		this.menu && this.menu.destruct();
		Dom.safeRemove(this.container);

		delete this.menu;
		delete this.container;
	}
}

pluginSystem.add('xpath', xpath);
