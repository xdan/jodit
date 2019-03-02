/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { debounce, throttle } from '../modules/helpers/async';
import { css } from '../modules/helpers/css';
import { IJodit } from '../types';

declare module '../Config' {
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

        if (editor.options.saveHeightInStorage) {
            editor.storage.set('height', height);
        }
    };

    const setWidth = (width: number | string) =>
        css(editor.container, 'width', width);

    const setHeightWorkPlace = (height: number | string) =>
        css(editor.workplace, 'height', height);
    // const setWidthWorkPlace = (width: number | string) => css(editor.workplace, 'width', width);

    if (
        editor.options.height !== 'auto' &&
        (editor.options.allowResizeX || editor.options.allowResizeY)
    ) {
        const handle: HTMLDivElement = editor.create.div(
                'jodit_editor_resize',
                '<a href="javascript:void(0)"></a>'
            ),
            start: { x: number; y: number; w: number; h: number } = {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
            };

        let isResized: boolean = false;

        editor.events
            .on(handle, 'mousedown touchstart', (e: MouseEvent) => {
                isResized = true;
                start.x = e.clientX;
                start.y = e.clientY;
                start.w = editor.container.offsetWidth;
                start.h = editor.container.offsetHeight;
                editor.lock();
                e.preventDefault();
            })
            .on(
                editor.ownerWindow,
                'mousemove touchmove',
                throttle((e: MouseEvent) => {
                    if (isResized) {
                        if (editor.options.allowResizeY) {
                            setHeight(start.h + e.clientY - start.y);
                        }

                        if (editor.options.allowResizeX) {
                            setWidth(start.w + e.clientX - start.x);
                        }

                        resizeWorkspaceImd();

                        editor.events.fire('resize');
                    }
                }, editor.defaultTimeout / 10)
            )
            .on(editor.ownerWindow, 'mouseup touchsend', () => {
                if (isResized) {
                    isResized = false;
                    editor.unlock();
                }
            })
            .on('afterInit', () => {
                editor.container.appendChild(handle);
            })
            .on('toggleFullSize', (fullsize: boolean) => {
                handle.style.display = fullsize ? 'none' : 'block';
            });
    }

    const getNotWorkHeight = (): number =>
        (editor.options.toolbar ? editor.toolbar.container.offsetHeight : 0) +
        (editor.statusbar ? editor.statusbar.container.offsetHeight : 0);

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
            editor.events.fire('setMinHeight', minHeightD);
        });
    };

    const resizeWorkspaceImd = () => {
        if (!editor || editor.isDestructed || !editor.options || editor.options.inline) {
            return;
        }

        calcMinHeightWorkspace();

        if (
            editor.container &&
            (editor.options.height !== 'auto' || editor.isFullSize())
        ) {
            setHeightWorkPlace(
                editor.container.offsetHeight - getNotWorkHeight()
            );
        }
    };

    const resizeWorkspace = debounce(resizeWorkspaceImd, editor.defaultTimeout);

    editor.events
        .on('toggleFullSize', (fullsize: boolean) => {
            if (!fullsize && editor.options.height === 'auto') {
                setHeightWorkPlace('auto');
                calcMinHeightWorkspace();
            }
        })
        .on(
            'afterInit',
            () => {
                if (!editor.options.inline) {
                    css(editor.editor, {
                        minHeight: '100%',
                    });

                    css(editor.container, {
                        minHeight: editor.options.minHeight,
                        minWidth: editor.options.minWidth,
                        maxWidth: editor.options.maxWidth,
                    });
                }

                let height: string | number = editor.options.height;

                if (editor.options.saveHeightInStorage && height !== 'auto') {
                    const localHeight: string | null = editor.storage.get(
                        'height'
                    );
                    if (localHeight) {
                        height = localHeight;
                    }
                }

                if (!editor.options.inline) {
                    setHeight(height);
                    setWidth(editor.options.width);
                }

                resizeWorkspaceImd();
            },
            undefined,
            undefined,
            true
        )
        .on(window, 'load', resizeWorkspace)
        .on(
            'afterInit resize updateToolbar scroll afterResize',
            resizeWorkspace
        );
}
