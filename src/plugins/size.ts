import Jodit from "../Jodit";
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

export default function (editor: Jodit) {
    if (editor.options.height !== 'auto' && (editor.options.allowResizeX || editor.options.allowResizeY)) {
        const handle: HTMLAnchorElement = <HTMLAnchorElement>dom('<div class="jodit_editor_resize" ><a href="javascript:void(0)"></a></div>', editor.ownerDocument),
            start: { x: number, y: number, w: number, h: number } = {
                x: 0, y: 0, w: 0, h: 0
            };

        let isResized: boolean = false;

        editor
            .__on(handle, 'mousedown touchstart', (e: MouseEvent) => {
                isResized = true;
                start.x = e.clientX;
                start.y = e.clientY;
                start.w = editor.container.offsetWidth;
                start.h = editor.container.offsetHeight;
                e.preventDefault();
            })
            .__on(editor.ownerWindow, 'mousemove touchmove', throttle((e: MouseEvent) => {
                if (isResized) {
                    css(editor.container, {
                        width: editor.options.allowResizeX ? start.w + e.clientX - start.x : start.w,
                        height: editor.options.allowResizeY ? start.h + e.clientY - start.y: start.h,
                    });
                    editor.events.fire('resize');
                }
            }, editor.options.observer.timeout))
            .__on(editor.ownerWindow, 'mouseup touchsend', () => {
                if (isResized) {
                    isResized = false;
                }
            })
            .events.on('afterInit', () => {
                editor.container.appendChild(handle);
            });
    }
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
            }
            if (editor.options.width !== 'auto') {
                css(editor.workplace, {
                    width: ''
                });
                css(editor.container, {
                    width: editor.options.width,
                });
            }
        }, '', true);
}