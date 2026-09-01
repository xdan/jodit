/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:plugins/fullsize/README.md]]
 * @packageDocumentation
 * @module plugins/fullsize
 */

import type { IViewWithToolbar } from 'jodit/types';
import { Dom } from 'jodit/core/dom/dom';
import { pluginSystem } from 'jodit/core/global';
import { isJoditObject } from 'jodit/core/helpers/checker/is-jodit-object';
import { css } from 'jodit/core/helpers/utils/css';

import './config';

import './fullsize.less';

const fullsizeStack = new Set();

/**
 * Process `toggleFullSize` event, and behavior - set/unset fullsize mode
 */
export function fullsize(editor: IViewWithToolbar): void {
	editor.registerButton({
		name: 'fullsize'
	});

	let isEnabled: boolean = false,
		oldHeight: number = 0,
		oldWidth: number = 0,
		savedScrollLeft: number = 0,
		savedScrollTop: number = 0,
		wasToggled = false;

	const resize = (): void => {
			const { container, events } = editor;
			if (!events) {
				return;
			}

			if (isEnabled) {
				// Save the original size only once, when entering fullsize.
				// Otherwise a window resize while in fullsize would overwrite it
				// with the current (fullscreen) size, so exiting fullsize would
				// restore the wrong dimensions (#1278).
				if (!wasToggled) {
					oldHeight = css(container, 'height', true) as number;
					oldWidth = css(container, 'width', true) as number;
					wasToggled = true;
				}

				css(container, {
					height: editor.ow.innerHeight,
					width: editor.ow.innerWidth
				});
			} else if (wasToggled) {
				css(container, {
					height: oldHeight || 'auto',
					width: oldWidth || 'auto'
				});

				wasToggled = false;
			}
		},
		/**
		 * Change editor's state between FullSize and normal
		 */
		toggle = (enable?: boolean): void => {
			const { container, events } = editor;

			if (!container) {
				return;
			}

			if (enable === undefined) {
				enable = !container.classList.contains('jodit_fullsize');
			}

			editor.setMod('fullsize', enable);

			editor.o.fullsize = enable;

			isEnabled = enable;

			container.classList.toggle('jodit_fullsize', enable);

			if (editor.toolbar) {
				isJoditObject(editor) &&
					editor.toolbarContainer &&
					Dom.append(
						editor.toolbarContainer,
						editor.toolbar.container
					);

				css(editor.toolbar.container, 'width', 'auto');
			}

			enable
				? fullsizeStack.add(container)
				: fullsizeStack.delete(container);

			const shouldToggleGlobalFullsize =
				editor.o.globalFullSize &&
				((fullsizeStack.size === 1 && enable) ||
					(fullsizeStack.size === 0 && !enable));

			if (shouldToggleGlobalFullsize) {
				// Entering fullsize sets `position: fixed` on <html>, which
				// makes the browser reset the page scroll to the top. Remember
				// the scroll position so it can be restored on exit (#1255).
				if (enable) {
					savedScrollLeft = editor.ow.scrollX;
					savedScrollTop = editor.ow.scrollY;
				}

				let node = container.parentNode as HTMLElement;

				while (
					node &&
					node.nodeType !== Node.DOCUMENT_NODE &&
					node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
				) {
					node.classList.toggle('jodit_fullsize-box_true', enable);
					node = node.parentNode as HTMLElement;
				}

				resize();

				if (!enable) {
					editor.ow.scrollTo(savedScrollLeft, savedScrollTop);
				}
			}

			events.fire('afterResize');
		};

	if (editor.o.globalFullSize) {
		editor.e.on(editor.ow, 'resize', resize);
	}

	editor.e
		.on('afterInit afterOpen', () => {
			editor.toggleFullSize(editor?.options?.fullsize);
		})
		.on('toggleFullSize', toggle)
		.on('beforeDestruct', () => {
			isEnabled && toggle(false);
		})
		.on('beforeDestruct', () => {
			editor.events && editor.e.off(editor.ow, 'resize', resize);
		});
}

pluginSystem.add('fullsize', fullsize);
