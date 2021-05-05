/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './sticky.less';

import type { IBound, IJodit } from '../../types';
import { Config } from '../../config';
import { IS_IE, MODE_WYSIWYG } from '../../core/constants';
import { Plugin, Dom } from '../../modules';
import { css, offset } from '../../core/helpers';
import { throttle } from '../../core/decorators';

declare module '../../config' {
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
		if (!isESNext && IS_IE && !this.dummyBox) {
			this.dummyBox = this.j.c.div();
			this.dummyBox.classList.add('jodit_sticky-dummy_toolbar');
			this.j.container.insertBefore(this.dummyBox, toolbar);
		}
	};

	/**
	 * Add sticky
	 * @param toolbar
	 */
	addSticky = (toolbar: HTMLElement): void => {
		if (!this.isToolbarSticked) {
			this.createDummy(toolbar);
			this.j.container.classList.add('jodit_sticky');

			this.isToolbarSticked = true;
		}

		// on resize it should work always
		css(toolbar, {
			top: this.j.o.toolbarStickyOffset || null,
			width: this.j.container.offsetWidth - 2
		});

		if (!isESNext && IS_IE && this.dummyBox) {
			css(this.dummyBox, {
				height: toolbar.offsetHeight
			});
		}
	};

	/**
	 * Remove sticky behaviour
	 * @param toolbar
	 */
	removeSticky = (toolbar: HTMLElement): void => {
		if (this.isToolbarSticked) {
			css(toolbar, {
				width: '',
				top: ''
			});

			this.j.container.classList.remove('jodit_sticky');
			this.isToolbarSticked = false;
		}
	};

	/** @override */
	afterInit(jodit: IJodit): void {
		jodit.e
			.on(
				jodit.ow,
				'scroll.sticky wheel.sticky mousewheel.sticky resize.sticky',
				this.onScroll
			)
			.on('getStickyState.sticky', () => this.isToolbarSticked);
	}

	/**
	 * Scroll handler
	 * @private
	 */
	@throttle()
	private onScroll(): void {
		const { jodit } = this;

		const scrollWindowTop: number =
				jodit.ow.pageYOffset ||
				(jodit.od.documentElement &&
					jodit.od.documentElement.scrollTop) ||
				0,
			offsetEditor: IBound = offset(
				jodit.container,
				jodit,
				jodit.od,
				true
			),
			doSticky: boolean =
				jodit.getMode() === MODE_WYSIWYG &&
				scrollWindowTop + jodit.o.toolbarStickyOffset >
					offsetEditor.top &&
				scrollWindowTop + jodit.o.toolbarStickyOffset <
					offsetEditor.top + offsetEditor.height &&
				!(jodit.o.toolbarDisableStickyForMobile && this.isMobile());

		if (
			jodit.o.toolbarSticky &&
			jodit.o.toolbar === true &&
			this.isToolbarSticked !== doSticky
		) {
			const container = jodit.toolbarContainer;

			if (container) {
				doSticky
					? this.addSticky(container)
					: this.removeSticky(container);
			}

			jodit.e.fire('toggleSticky', doSticky);
		}
	}

	/**
	 * Is mobile device
	 * @private
	 */
	private isMobile(): boolean {
		return (
			this.j &&
			this.j.options &&
			this.j.container &&
			this.j.o.sizeSM >= this.j.container.offsetWidth
		);
	}

	/** @override */
	beforeDestruct(jodit: IJodit): void {
		this.dummyBox && Dom.safeRemove(this.dummyBox);
		jodit.e
			.off(
				jodit.ow,
				'scroll.sticky wheel.sticky mousewheel.sticky resize.sticky',
				this.onScroll
			)
			.off('.sticky');
	}
}
