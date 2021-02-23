/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './xpath.less';

import type { IControlTypeStrong, IToolbarButton } from '../../types';
import { Config } from '../../config';
import { INVISIBLE_SPACE, MODE_WYSIWYG } from '../../core/constants';
import { ContextMenu } from '../../modules/context-menu/context-menu';
import { Dom } from '../../core/dom';
import { getXPathByElement, trim, attr } from '../../core/helpers';
import { Plugin } from '../../core/plugin';
import { makeButton } from '../../modules/toolbar/factory';

declare module '../../config' {
	interface Config {
		showXPathInStatusbar: boolean;
	}
}

Config.prototype.showXPathInStatusbar = true;

/**
 * Show path to current element in status bar
 */
export class xpath extends Plugin {
	private onContext = (bindElement: Node, event: MouseEvent) => {
		if (!this.menu) {
			this.menu = new ContextMenu(this.j);
		}

		this.menu.show(event.clientX, event.clientY, [
			{
				icon: 'bin',
				title: bindElement === this.j.editor ? 'Clear' : 'Remove',
				exec: () => {
					if (bindElement !== this.j.editor) {
						Dom.safeRemove(bindElement);
					} else {
						this.j.value = '';
					}
					this.j.setEditorValue();
				}
			},
			{
				icon: 'select-all',
				title: 'Select',
				exec: () => {
					this.j.s.select(bindElement);
				}
			}
		]);

		return false;
	};

	private onSelectPath = (bindElement: Node, event: MouseEvent) => {
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

	private tpl = (
		bindElement: Node,
		path: string,
		name: string,
		title: string
	): HTMLElement => {
		const item = this.j.c.fromHTML(
			`<span class="jodit-xpath__item"><a role="button" data-path="${path}" href="javascript:void(0)" title="${title}" tabindex="-1"'>${trim(
				name
			)}</a></span>`
		) as HTMLLIElement;

		const a = item.firstChild as HTMLAnchorElement;

		this.j.e
			.on(a, 'click', this.onSelectPath.bind(this, bindElement))
			.on(a, 'contextmenu', this.onContext.bind(this, bindElement));

		return item;
	};

	private selectAllButton?: IToolbarButton;

	private removeSelectAll = () => {
		if (this.selectAllButton) {
			this.selectAllButton.destruct();
			delete this.selectAllButton;
		}
	};

	private appendSelectAll = () => {
		this.removeSelectAll();

		this.selectAllButton = makeButton(this.j, {
			name: 'selectall',
			...this.j.o.controls.selectall
		} as IControlTypeStrong);

		this.selectAllButton.state.size = 'tiny';

		this.container &&
			this.container.insertBefore(
				this.selectAllButton.container,
				this.container.firstChild
			);
	};

	private calcPathImd = () => {
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
						li = this.tpl(
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

		this.appendSelectAll();
	};

	private calcPath: () => void = this.j.async.debounce(
		this.calcPathImd,
		this.j.defaultTimeout * 2
	);

	container?: HTMLElement;
	menu?: ContextMenu;

	afterInit(): void {
		if (this.j.o.showXPathInStatusbar) {
			this.container = this.j.c.div('jodit-xpath');

			this.j.e
				.off('.xpath')
				.on(
					'mouseup.xpath change.xpath keydown.xpath changeSelection.xpath',
					this.calcPath
				)
				.on(
					'afterSetMode.xpath afterInit.xpath changePlace.xpath',
					() => {
						if (!this.j.o.showXPathInStatusbar || !this.container) {
							return;
						}

						this.j.statusbar.append(this.container);

						if (this.j.getRealMode() === MODE_WYSIWYG) {
							this.calcPath();
						} else {
							if (this.container) {
								this.container.innerHTML = INVISIBLE_SPACE;
							}
							this.appendSelectAll();
						}
					}
				);

			this.calcPath();
		}
	}

	beforeDestruct(): void {
		if (this.j && this.j.events) {
			this.j.e.off('.xpath');
		}

		this.removeSelectAll();

		this.menu && this.menu.destruct();
		Dom.safeRemove(this.container);

		delete this.menu;
		delete this.container;
	}
}
