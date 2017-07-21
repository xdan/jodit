import Jodit from '../Jodit';
import {$$, debounce, offset} from "../modules/Helpers";

const JODIT_IMAGE_PROCESSOR_BINDED = '__jodit_imageprocessor_binded';

Jodit.plugins.imageProcessor = function (editor: Jodit) {
    let dragImage;
    const bind = (image: HTMLImageElement) => {
            editor
                .__off(image, '.imageProcessor')
                .__on(image, 'dragstart.imageProcessor', (e) => {
                    dragImage = image;
                    e.preventDefault(); // stop default dragging
                })
                .__on(image, 'mousedown.imageProcessor', (e) => {
                    dragImage = image;
                    const pos = offset(image);
                    editor.events.fire('showPopap', [image, Math.round(pos.left + (image.offsetWidth / 2)), Math.round(pos.top + image.offsetHeight)]);
                });
        };

    editor
        .__on(editor.editor, "mousemove",  debounce((e: MouseEvent) => {
            if (dragImage) {
                editor.selection.insertCursorAtPoint(e.clientX, e.clientY);
            }
        },  editor.options.observer.timeout))
        .__on(window, "mouseup", () => {
            dragImage = false;
        })
        .__on(editor.editor, "mouseup", (e: DragEvent) => {
            let img = dragImage, elm;

            if (img) {
                e.preventDefault();

                if (editor.selection.insertCursorAtPoint(e.clientX, e.clientY) === false) {
                    return false;
                }

                if (img.parentNode && (<HTMLElement>img.parentNode).tagName === 'A' && !img.parentNode.textContent.length) {
                    elm = img.parentNode;
                } else {
                    elm = img;
                }

                elm.parentNode.removeChild(elm);

                editor.selection.insertImage(elm);

                editor.selection.select(elm);

                editor.events.fire('hidePopap');
            }
        });
    editor.events.on('change', debounce(() => {
        $$('img', editor.editor).forEach((elm: HTMLImageElement) => {
            if (!elm[JODIT_IMAGE_PROCESSOR_BINDED]) {
                elm[JODIT_IMAGE_PROCESSOR_BINDED] = true;
                bind(elm);
            }
        });
    }, editor.options.observer.timeout));
};