import Jodit from "../Jodit";
import {css, debounce, dom, throttle} from "../modules/Helpers";
import Toolbar from "../modules/Toolbar";
import {Config} from '../Config'

declare module "../Config" {
    interface Config {
        mobileTapTimeout: number;
    }
}


Jodit.plugins.resizeEditor = function (editor: Jodit) {
    if (editor.options.height !== 'auto') {
        const handle: HTMLAnchorElement = <HTMLAnchorElement>dom('<div class="jodit_editor_resize" ><a href="javascript:void(0)">' + Toolbar.getIcon('resize') + '</a></div>'),
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
            .__on(window, 'mousemove touchmove', throttle((e: MouseEvent) => {
                if (isResized) {
                    css(editor.container, {
                        width: start.w + e.clientX - start.x,
                        height: start.h + e.clientY - start.y,
                    });
                    editor.events.fire('resize');
                }
            }, editor.options.observer.timeout))
            .__on(window, 'mouseup touchsend', (e: MouseEvent) => {
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
                css(editor.workplace, {
                    height: '100%'
                });
                css(editor.container, {
                    height: editor.options.height,
                });
            }
        });
}