/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { INVISIBLE_SPACE, MODE_WYSIWYG } from '../constants';
import { ContextMenu } from '../modules/ContextMenu';
import { Dom } from '../modules/Dom';
import { getXPathByElement } from '../modules/helpers/selector';
import { Plugin } from '../modules/Plugin';
import { ToolbarButton } from '../modules/toolbar/button';
import { IControlType, IControlTypeStrong } from '../types/toolbar';
import { trim } from '../modules/helpers/string';

declare module '../Config' {
	interface Config {
		showXPathInStatusbar: boolean;
	}
}

Config.prototype.controls.selectall = {
	icon: 'select-all',
	command: 'selectall',
	tooltip: 'Select all'
} as IControlType;

Config.prototype.showXPathInStatusbar = true;

/**
 * Show path to current element in status bar
 */
export class xpath extends Plugin {
	private onContext = (bindElement: Node, event: MouseEvent) => {
		if (!this.menu) {
			this.menu = new ContextMenu(this.jodit);
		}

		this.menu.show(event.clientX, event.clientY, [
			{
				icon: 'bin',
				title: bindElement === this.jodit.editor ? 'Clear' : 'Remove',
				exec: () => {
					if (bindElement !== this.jodit.editor) {
						Dom.safeRemove(bindElement);
					} else {
						this.jodit.value = '';
					}
					this.jodit.setEditorValue();
				}
			},
			{
				icon: 'select-all',
				title: 'Select',
				exec: () => {
					this.jodit.selection.select(bindElement);
				}
			}
		]);

		return false;
	};

	private onSelectPath = (bindElement: Node, event: MouseEvent) => {
		this.jodit.selection.focus();

		const path: string =
			(event.target as HTMLElement).getAttribute('data-path') || '/';

		if (path === '/') {
			this.jodit.execCommand('selectall');
			return false;
		}

		try {
			const elm: Node | null = this.jodit.editorDocument
				.evaluate(
					path,
					this.jodit.editor,
					null,
					XPathResult.ANY_TYPE,
					null
				)
				.iterateNext();

			if (elm) {
				this.jodit.selection.select(elm);
				return false;
			}
		} catch {}

		this.jodit.selection.select(bindElement);

		return false;
	};

	private tpl = (
		bindElement: Node,
		path: string,
		name: string,
		title: string
	): HTMLElement => {
		const li = this.jodit.create.fromHTML(
			`<li><a role="button" data-path="${path}" href="javascript:void(0)" title="${title}" tabindex="-1"'>${trim(
				name
			)}</a></li>`
		) as HTMLLIElement;

		const a = li.firstChild as HTMLAnchorElement;

		this.jodit.events
			.on(a, 'click', this.onSelectPath.bind(this, bindElement))
			.on(a, 'contextmenu', this.onContext.bind(this, bindElement));

		return li;
	};

	private selectAllButton!: ToolbarButton;

	private removeSelectAll = () => {
		if (this.selectAllButton) {
			this.selectAllButton.destruct();
			delete this.selectAllButton;
		}
	};

	private appendSelectAll = () => {
		this.removeSelectAll();
		this.selectAllButton = new ToolbarButton(this.jodit, <
			IControlTypeStrong
		>{
			name: 'selectall',
			...this.jodit.options.controls.selectall
		});

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

		const current: Node | false = this.jodit.selection.current();

		if (this.container) {
			this.container.innerHTML = INVISIBLE_SPACE;
		}

		if (current) {
			let name: string, xpth: string, li: HTMLElement;

			Dom.up(
				current,
				(elm: Node | null) => {
					if (elm && this.jodit.editor !== elm && !Dom.isText(elm)) {
						name = elm.nodeName.toLowerCase();
						xpth = getXPathByElement(
							elm as HTMLElement,
							this.jodit.editor
						).replace(/^\//, '');
						li = this.tpl(
							elm,
							xpth,
							name,
							this.jodit.i18n('Select %s', name)
						);

						this.container &&
							this.container.insertBefore(
								li,
								this.container.firstChild
							);
					}
				},
				this.jodit.editor
			);
		}

		this.appendSelectAll();
	};

	private calcPath: () => void = this.jodit.async.debounce(
		this.calcPathImd,
		this.jodit.defaultTimeout * 2
	);

	container!: HTMLElement;
	menu: ContextMenu | null = null;

	afterInit() {
		if (this.jodit.options.showXPathInStatusbar) {
			this.container = this.jodit.create.element('ul');
			this.container.classList.add('jodit_xpath');

			this.jodit.events
				.off('.xpath')
				.on(
					'mouseup.xpath change.xpath keydown.xpath changeSelection.xpath',
					this.calcPath
				)
				.on(
					'afterSetMode.xpath afterInit.xpath changePlace.xpath',
					() => {
						if (!this.jodit.options.showXPathInStatusbar) {
							return;
						}

						this.jodit.statusbar.append(this.container);

						if (this.jodit.getRealMode() === MODE_WYSIWYG) {
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
		if (this.jodit && this.jodit.events) {
			this.jodit.events.off('.xpath');
		}

		this.removeSelectAll();

		this.menu && this.menu.destruct();
		Dom.safeRemove(this.container);

		delete this.menu;
		delete this.container;
	}
}
