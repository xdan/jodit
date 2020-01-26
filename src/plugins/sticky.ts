/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { IS_IE, MODE_WYSIWYG } from '../constants';
import { Plugin } from '../modules/Plugin';
import { css } from '../modules/helpers/css';
import { offset } from '../modules/helpers/size';
import { IBound } from '../types/types';
import { Dom } from '../modules/Dom';
import { IJodit } from '../types';

declare module '../Config' {
	interface Config {
		/**
		 * @type {boolean}
		 * @example
		 * ```javascript
		 * var editor = new Jodit('#someid', {
		 *  toolbarSticky: false
		 * })
		 * ```
		 */
		toolbarSticky: boolean;
		toolbarDisableStickyForMobile: boolean;
		/**
		 * For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to
		 * move the toolbar Jodit by this amount [more](http://xdsoft.net/jodit/doc/#2.5.57)
		 *
		 * @example
		 * ```javascript
		 * var editor = new Jodit('#someid', {
		 *  toolbarStickyOffset: 100
		 * })
		 * ```
		 */
		toolbarStickyOffset: number;
	}
}

Config.prototype.toolbarSticky = true;
Config.prototype.toolbarDisableStickyForMobile = true;
Config.prototype.toolbarStickyOffset = 0;

export class sticky extends Plugin {
	private isToolbarSticked: boolean = false;
	private dummyBox?: HTMLElement;

	private createDummy = (toolbar: HTMLElement) => {
		if (IS_IE && !this.dummyBox) {
			this.dummyBox = this.jodit.create.div();
			this.dummyBox.classList.add('jodit_sticky-dummy_toolbar');
			this.jodit.container.insertBefore(this.dummyBox, toolbar);
		}
	};

	private isMobile(): boolean {
		return (
			this.jodit &&
			this.jodit.options &&
			this.jodit.container &&
			this.jodit.options.sizeSM >= this.jodit.container.offsetWidth
		);
	}

	addSticky = (toolbar: HTMLElement) => {
		if (!this.isToolbarSticked) {
			this.createDummy(toolbar);
			this.jodit.container.classList.add('jodit_sticky');

			this.isToolbarSticked = true;
		}

		// on resize it should work always
		css(toolbar, {
			top: this.jodit.options.toolbarStickyOffset,
			width: this.jodit.container.offsetWidth
		});

		if (IS_IE && this.dummyBox) {
			css(this.dummyBox, {
				height: toolbar.offsetHeight
			});
		}
	};

	removeSticky = (toolbar: HTMLElement) => {
		if (this.isToolbarSticked) {
			css(toolbar, {
				width: '',
				top: ''
			});

			this.jodit.container.classList.remove('jodit_sticky');
			this.isToolbarSticked = false;
		}
	};

	afterInit(jodit: IJodit) {
		jodit.events.on(
			jodit.ownerWindow,
			'scroll wheel mousewheel resize',
			() => {
				const scrollWindowTop: number =
						jodit.ownerWindow.pageYOffset ||
						(jodit.ownerDocument.documentElement &&
							jodit.ownerDocument.documentElement.scrollTop) ||
						0,

					offsetEditor: IBound = offset(
						jodit.container,
						jodit,
						jodit.ownerDocument,
						true
					),

					doSticky: boolean =
						jodit.getMode() === MODE_WYSIWYG &&
						(scrollWindowTop + jodit.options.toolbarStickyOffset >
							offsetEditor.top &&
							scrollWindowTop +
								jodit.options.toolbarStickyOffset <
								offsetEditor.top + offsetEditor.height) &&
						!(
							jodit.options.toolbarDisableStickyForMobile &&
							this.isMobile()
						);

				if (jodit.options.toolbarSticky && jodit.options.toolbar === true) {
					doSticky
						? this.addSticky(jodit.toolbar.getParentContainer())
						: this.removeSticky(jodit.toolbar.getParentContainer());
				}

				jodit.events.fire('toggleSticky', doSticky);
			}
		);
	}

	beforeDestruct(jodit?: IJodit): void {
		this.dummyBox && Dom.safeRemove(this.dummyBox);
	}
}
