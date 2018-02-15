/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {$$, debounce, throttle} from "../modules/Helpers";

const JODIT_IMAGE_PROCESSOR_BINDED = '__jodit_imageprocessor_binded';

export function imageProcessor(editor: Jodit) {
    let dragImage: HTMLImageElement|false;
    const bind = (image: HTMLImageElement) => {
        editor.events
            .off(image, '.imageProcessor')
            .on(image, 'dragstart.imageProcessor', (e: MouseEvent) => {
                dragImage = <HTMLImageElement>image;
                e.preventDefault(); // stop default dragging
            })
            .on(image, 'mousedown.imageProcessor touchstart.imageProcessor', () => {
                dragImage = <HTMLImageElement>image;
            });
    };

    editor.events.on('afterInit',() => {
        editor.events
            .on(editor.editor, "mousemove touchmove", throttle((e: MouseEvent) => {
                if (dragImage) {
                    editor.events.fire('hidePopup');
                    editor.selection.insertCursorAtPoint(e.clientX, e.clientY);
                }
            }, editor.options.observer.timeout))
            .on(window, "mouseup touchend", () => {
                dragImage = false;
            })
            .on(editor.editor, "mouseup touchend", (e: DragEvent): false | void => {
                let img: HTMLImageElement = <HTMLImageElement>dragImage,
                    elm: Node | null = null;

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

                    if (elm.parentNode) {
                        elm.parentNode.removeChild(elm);
                    }

                    if (elm) {
                        editor.selection.insertImage(<HTMLImageElement>elm);
                    }
                }

                if ((elm && elm.nodeName === 'IMG') || (<Node>e.target).nodeName === 'IMG') {
                    editor.selection.select((elm && elm.nodeName === 'IMG') ? elm : <Node>e.target);
                }
            });
    });

    editor.events.on('change afterInit', debounce(() => {
        if (editor.editor) {
            $$('img', editor.editor).forEach((elm: HTMLElement) => {
                if (!(<any>elm)[JODIT_IMAGE_PROCESSOR_BINDED]) {
                    (<any>elm)[JODIT_IMAGE_PROCESSOR_BINDED] = true;
                    bind(<HTMLImageElement>elm);
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