/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';
import {$$, debounce, throttle} from "../modules/Helpers";

const JODIT_IMAGE_PROCESSOR_BINDED = '__jodit_imageprocessor_binded';

export function imageProcessor(editor: Jodit) {
    let dragImage: HTMLImageElement|false;
    const bind = (image: HTMLImageElement) => {
        editor
            .__off(image, '.imageProcessor')
            .__on(image, 'dragstart.imageProcessor', (e) => {
                dragImage = <HTMLImageElement>image;
                e.preventDefault(); // stop default dragging
            })
            .__on(image, 'mousedown.imageProcessor', () => {
                dragImage = <HTMLImageElement>image;
            });
    };

    editor.events.on('afterInit',() => {
        editor
            .__on(editor.editor, "mousemove", throttle((e: MouseEvent) => {
                if (dragImage) {
                    editor.selection.insertCursorAtPoint(e.clientX, e.clientY);
                }
            }, editor.options.observer.timeout))
            .__on(window, "mouseup", () => {
                dragImage = false;
            })
            .__on(editor.editor, "mouseup", (e: DragEvent) => {
                let img: HTMLImageElement = <HTMLImageElement>dragImage,
                    elm;

                if (img && e.target !== img) {
                    //e.preventDefault();

                    if (editor.selection.insertCursorAtPoint(e.clientX, e.clientY) === false) {
                        return false;
                    }

                    if (img.parentNode && (<HTMLElement>img.parentNode).tagName === 'A' && (!img.parentNode.textContent || !img.parentNode.textContent.length)) {
                        elm = img.parentNode;
                    } else {
                        elm = img;
                    }

                    elm.parentNode.removeChild(elm);

                    editor.selection.insertImage(elm);

                    editor.selection.select(elm);
                }
            });
    });

    editor.events.on('change afterInit', debounce(() => {
        if (editor.editor) {
            $$('img', editor.editor).forEach((elm: HTMLImageElement) => {
                if (!elm[JODIT_IMAGE_PROCESSOR_BINDED]) {
                    elm[JODIT_IMAGE_PROCESSOR_BINDED] = true;
                    bind(elm);
                    if (!(<HTMLImageElement>elm).complete) {
                        elm.addEventListener('load', function ElementOnLoad() {
                            editor.events && editor.events.fire && editor.events.fire('resize');
                            elm.removeEventListener('load', ElementOnLoad);
                        });
                    }
                }
            });
        }
    }, editor.options.observer.timeout));
}