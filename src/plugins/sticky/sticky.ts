/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/sticky/README.md]]
 * @packageDocumentation
 * @module plugins/sticky
 */

import type { IJodit } from 'jodit/types';
import { IS_ES_NEXT, IS_IE, MODE_WYSIWYG } from 'jodit/core/constants';
import { throttle } from 'jodit/core/decorators';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { css, offset } from 'jodit/core/helpers';
import { Plugin } from 'jodit/core/plugin/plugin';

import './config';

import './sticky.less';

const NEED_DUMMY_BOX = !IS_ES_NEXT && IS_IE;

export class sticky extends Plugin {
	private __isToolbarStuck: boolean = false;
	private __dummyBox?: HTMLElement;

	private __createDummy = (toolbar: HTMLElement): void => {
		this.__dummyBox = this.j.c.div();
		this.__dummyBox.classList.add('jodit_sticky-dummy_toolbar');
		this.j.container.insertBefore(this.__dummyBox, toolbar);
	};

	/**
	 * Add sticky
	 */
	addSticky = (toolbar: HTMLElement): void => {
		if (!this.__isToolbarStuck) {
			if (NEED_DUMMY_BOX && !this.__dummyBox) {
				this.__createDummy(toolbar);
			}

			this.j.container.classList.add('jodit_sticky');
			this.__isToolbarStuck = true;
		}

		// on resize, it should work always
		css(toolbar, {
			top: this.j.o.toolbarStickyOffset || null,
			width: this.j.container.offsetWidth - 2
		});

		this.__dummyBox &&
			css(this.__dummyBox, {
				height: toolbar.offsetHeight
			});
	};

	/**
	 * Remove sticky behaviour
	 */
	removeSticky = (toolbar: HTMLElement): void => {
		if (!this.__isToolbarStuck) {
			return;
		}

		css(toolbar, {
			width: '',
			top: ''
		});

		this.j.container.classList.remove('jodit_sticky');
		this.__isToolbarStuck = false;
	};

	afterInit(jodit: IJodit): void {
		jodit.e
			.on(
				jodit.ow,
				'scroll.sticky wheel.sticky mousewheel.sticky resize.sticky',
				this.__onScroll
			)
			.on('getStickyState.sticky', () => this.__isToolbarStuck);
	}

	/**
	 * Scroll handler
	 */
	@throttle()
	private __onScroll(): void {
		const { jodit } = this;

		if (!jodit.o.toolbarSticky || !jodit.o.toolbar) {
			return;
		}

		const scrollWindowTop: number =
			jodit.ow.pageYOffset ||
			(jodit.od.documentElement && jodit.od.documentElement.scrollTop) ||
			0;

		const offsetEditor = offset(jodit.container, jodit, jodit.od, true);

		const doSticky =
			jodit.getMode() === MODE_WYSIWYG &&
			scrollWindowTop + jodit.o.toolbarStickyOffset > offsetEditor.top &&
			scrollWindowTop + jodit.o.toolbarStickyOffset <
				offsetEditor.top + offsetEditor.height &&
			!(jodit.o.toolbarDisableStickyForMobile && this.__isMobile());

		if (this.__isToolbarStuck === doSticky) {
			return;
		}

		const container = jodit.toolbarContainer;

		if (container) {
			doSticky ? this.addSticky(container) : this.removeSticky(container);
		}

		jodit.e.fire('toggleSticky', doSticky);
	}

	/**
	 * Is mobile device
	 */
	private __isMobile(): boolean {
		const { j } = this;
		return (
			j &&
			j.options &&
			j.container &&
			j.options.sizeSM >= j.container.offsetWidth
		);
	}

	override beforeDestruct(jodit: IJodit): void {
		Dom.safeRemove(this.__dummyBox);

		jodit.e
			.off(
				jodit.ow,
				'scroll.sticky wheel.sticky mousewheel.sticky resize.sticky',
				this.__onScroll
			)
			.off('.sticky');
	}
}

pluginSystem.add('sticky', sticky);
