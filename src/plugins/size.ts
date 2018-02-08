/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from "../Jodit";
import {css, dom, throttle} from "../modules/Helpers";
import {Config} from '../Config'

declare module "../Config" {
    interface Config {
        allowResizeX: boolean;
        allowResizeY: boolean;
    }
}

Config.prototype.allowResizeX = false;
Config.prototype.allowResizeY = true;

export function size(editor: Jodit) {
    if (editor.options.height !== 'auto' && (editor.options.allowResizeX || editor.options.allowResizeY)) {
        const handle: HTMLAnchorElement = <HTMLAnchorElement>dom('<div class="jodit_editor_resize" ><a href="javascript:void(0)"></a></div>', editor.ownerDocument),
            start: { x: number, y: number, w: number, h: number } = {
                x: 0, y: 0, w: 0, h: 0
            };

        let isResized: boolean = false;

        editor.events
            .on(handle, 'mousedown touchstart', (e: MouseEvent) => {
                isResized = true;
                start.x = e.clientX;
                start.y = e.clientY;
                start.w = editor.container.offsetWidth;
                start.h = editor.container.offsetHeight;
                e.preventDefault();
            })
            .on(editor.ownerWindow, 'mousemove touchmove', throttle((e: MouseEvent) => {
                if (isResized) {
                    css(editor.container, {
                        width: editor.options.allowResizeX ? start.w + e.clientX - start.x : start.w,
                        height: editor.options.allowResizeY ? start.h + e.clientY - start.y: start.h,
                    });
                    editor.events.fire('resize');
                }
            }, editor.options.observer.timeout))
            .on(editor.ownerWindow, 'mouseup touchsend', () => {
                if (isResized) {
                    isResized = false;
                }
            })
            .on('afterInit', () => {
                editor.container.appendChild(handle);
            });
    }

    const resizeWorkspace = () => {
        css(editor.workplace, {
            height: editor.container.offsetHeight - editor.toolbar.container.offsetHeight
        });
    };

    editor.events
        .on('afterInit', () => {
            css(editor.editor, {
                minHeight: editor.options.minHeight
            });

            css(editor.workplace, {
                width: editor.options.width,
                height: editor.options.height,
                minHeight: editor.options.minHeight
            });

            if (editor.options.height !== 'auto') {
                css(editor.editor, {
                    minHeight: '100%'
                });
                css(editor.workplace, {
                    height: '',
                    minHeight: ''
                });
                css(editor.container, {
                    height: editor.options.height,
                });
                resizeWorkspace();
            }
            if (editor.options.width !== 'auto') {
                css(editor.workplace, {
                    width: ''
                });
                css(editor.container, {
                    width: editor.options.width,
                });
            }
        }, undefined, undefined,true);

    if (editor.options.height !== 'auto') {
        editor.events
            .on(window, 'load', resizeWorkspace)
            .on('afterInit resize updateToolbar scroll', resizeWorkspace)
    }
}