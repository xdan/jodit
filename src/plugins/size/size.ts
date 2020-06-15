/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import './size.less';

import { Config } from '../../config';
import { css } from '../../core/helpers';
import { IJodit, IPointBound } from '../../types';

declare module '../../config' {
	interface Config {
		allowResizeX: boolean;
		allowResizeY: boolean;
	}
}

Config.prototype.allowResizeX = false;
Config.prototype.allowResizeY = true;

/**
 * Resize editor
 * @param {Jodit} editor
 */
export function size(editor: IJodit) {
	const setHeight = (height: number | string) => {
		css(editor.container, 'height', height);

		if (editor.o.saveHeightInStorage) {
			editor.storage.set('height', height);
		}
	};

	const setWidth = (width: number | string) =>
		css(editor.container, 'width', width);

	const setHeightWorkPlace = (height: number | string) =>
		css(editor.workplace, 'height', height);
	// const setWidthWorkPlace = (width: number | string) => css(editor.workplace, 'width', width);

	if (
		editor.o.height !== 'auto' &&
		(editor.o.allowResizeX || editor.o.allowResizeY)
	) {
		const handle = editor.c.div(
				'jodit-editor__resize',
				'<a tabindex="-1" href="javascript:void(0)"></a>'
			),
			start: IPointBound = {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			};

		let isResized: boolean = false;

		const onMouseMove = editor.async.throttle((e: MouseEvent) => {
			if (!isResized) {
				return;
			}

			if (editor.o.allowResizeY) {
				setHeight(start.h + e.clientY - start.y);
			}

			if (editor.o.allowResizeX) {
				setWidth(start.w + e.clientX - start.x);
			}

			resizeWorkspaceImd();

			editor.e.fire('resize');
		}, editor.defaultTimeout / 10);

		editor.e
			.on(handle, 'mousedown touchstart', (e: MouseEvent) => {
				isResized = true;

				start.x = e.clientX;
				start.y = e.clientY;
				start.w = editor.container.offsetWidth;
				start.h = editor.container.offsetHeight;

				editor.lock();

				editor.e.on(editor.ow, 'mousemove touchmove', onMouseMove);

				e.preventDefault();
			})
			.on(editor.ow, 'mouseup touchsend', () => {
				if (isResized) {
					isResized = false;

					editor.e.off(editor.ow, 'mousemove touchmove', onMouseMove);

					editor.unlock();
				}
			})
			.on('afterInit', () => {
				editor.container.appendChild(handle);
			})
			.on('toggleFullSize', (fullSize: boolean) => {
				handle.style.display = fullSize ? 'none' : 'block';
			});
	}

	const getNotWorkHeight = (): number =>
		(editor.o.toolbar ? editor.toolbar.container.offsetHeight : 0) +
		(editor.statusbar ? editor.statusbar.getHeight() : 0);

	const calcMinHeightWorkspace = () => {
		if (!editor.container || !editor.container.parentNode) {
			return;
		}

		const minHeight: number =
			(css(editor.container, 'minHeight') as number) - getNotWorkHeight();

		[editor.workplace, editor.iframe, editor.editor].map(elm => {
			const minHeightD: number =
				elm === editor.editor ? minHeight - 2 : minHeight; // borders
			elm && css(elm as HTMLElement, 'minHeight', minHeightD);
			editor.e.fire('setMinHeight', minHeightD);
		});
	};

	const resizeWorkspaceImd = () => {
		if (
			!editor ||
			editor.isDestructed ||
			!editor.options ||
			editor.o.inline
		) {
			return;
		}

		calcMinHeightWorkspace();

		if (
			editor.container &&
			(editor.o.height !== 'auto' || editor.isFullSize)
		) {
			setHeightWorkPlace(
				editor.container.offsetHeight - getNotWorkHeight()
			);
		}
	};

	const resizeWorkspace = editor.async.debounce(
		resizeWorkspaceImd,
		editor.defaultTimeout
	);

	editor.e
		.on('toggleFullSize', (fullsize: boolean) => {
			if (!fullsize && editor.o.height === 'auto') {
				setHeightWorkPlace('auto');
				calcMinHeightWorkspace();
			}
		})
		.on(
			'afterInit changePlace',
			() => {
				if (!editor.o.inline) {
					css(editor.editor, {
						minHeight: '100%'
					});

					css(editor.container, {
						minHeight: editor.o.minHeight,
						minWidth: editor.o.minWidth,
						maxWidth: editor.o.maxWidth
					});
				}

				let height: string | number = editor.o.height;

				if (editor.o.saveHeightInStorage && height !== 'auto') {
					const localHeight = editor.storage.get<string>('height');

					if (localHeight) {
						height = localHeight;
					}
				}

				if (!editor.o.inline) {
					setHeight(height);
					setWidth(editor.o.width);
				}

				resizeWorkspaceImd();
			},
			undefined,
			true
		)
		.on(window, 'load', resizeWorkspace)
		.on(
			'afterInit resize updateToolbar scroll afterResize',
			resizeWorkspace
		);
}
