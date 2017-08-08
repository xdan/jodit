import Jodit from '../Jodit';
import {Config} from '../Config'
import {$$, dom, isIE, offset} from '../modules/Helpers'
import Dom from "../modules/Dom";

/**
 * The module creates a supporting frame for resizing of the elements img and table
 * @module Resizer
 * @params {Object} parent Jodit main object
 */
/**
 * @prop {boolean} useIframeResizer=true Use true frame for editing iframe size
 * @memberof Jodit.defaultOptions
 */
declare module "../Config" {
    interface Config {
        useIframeResizer: boolean;
        useTableResizer: boolean;
        useImageResizer: boolean;
        resizer: {
            min_width : number;
            min_height : number;
        }
    }
}
Config.prototype.useIframeResizer = true;


/**
 * @prop {boolean} useTableResizer=true Use true frame for editing table size
 * @memberof Jodit.defaultOptions
 */
Config.prototype.useTableResizer = true;

/**
 * @prop {boolean} useImageResizer=true Use true image editing frame size
 * @memberof Jodit.defaultOptions
 */
Config.prototype.useImageResizer = true;
/**
 * @prop {object} resizer
 * @prop {int} resizer.min_width=10 The minimum width for the editable element
 * @prop {int} resizer.min_height=10 The minimum height for the item being edited
 * @memberof Jodit.defaultOptions
 */
Config.prototype.resizer = {
    min_width : 10,
    min_height : 10
};

Jodit.plugins.Resizer = function (editor: Jodit) {
    // let clicked = false,
    //     resized = false,
    let
        handle: HTMLElement,

        currentElement: null|HTMLElement,
        // resizeElementClicked: boolean = false,
        isResizing: boolean = false,

        start_x: number,
        start_y: number,
        width: number,
        height: number,
        ratio: number,
        new_h: number,
        new_w: number,
        diff_x: number,
        diff_y: number,

        // timeouts = [],

        resizerIsVisible: boolean = false;

    const resizer: HTMLElement = dom('<div style="display:none" class="jodit_resizer">' +
            '<i class="jodit_resizer-topleft"></i>' +
            '<i class="jodit_resizer-topright"></i>' +
            '<i class="jodit_resizer-bottomright"></i>' +
            '<i class="jodit_resizer-bottomleft"></i>' +
        '</div>', document),

        hideResizer = () => {
            isResizing = false;
            resizerIsVisible = false;
            currentElement = null;
            resizer.style.display = 'none';
        },

        updateSize = () => {
            if (resizerIsVisible) {
                const pos = offset(currentElement, editor);
                // 1 - because need move border higher and to the left than the picture
                // 2 - in box-sizing: border-box mode width is real width indifferent by border-width.
                resizer.style.top = (pos.top - 1) + 'px';
                resizer.style.left = (pos.left - 1) + 'px';
                resizer.style.width = (currentElement.offsetWidth) + 'px';
                resizer.style.height = (currentElement.offsetHeight) + 'px';

                editor.events.fire(currentElement, 'changesize');
            }
        },

        showResizer = () => {
            resizerIsVisible = true;
            resizer.style.display = 'block';
            updateSize();
        },



        /**
         * Bind an edit element to element
         * @param {HTMLElement} element The element that you want to add a function to resize
         */
        bind = (element: HTMLElement) => {
            let wrapper: HTMLElement;
            if (element.tagName === 'IFRAME') {
                if (element.parentNode && (<HTMLElement>element.parentNode).getAttribute('data-jodit_iframe_wrapper')) {
                    element = <HTMLElement>element.parentNode;
                } else {
                    wrapper = dom('<div data-jodit-temp="1" contenteditable="false" draggable="true" data-jodit_iframe_wrapper="1"></div>', document);

                    wrapper.style.display = element.style.display === 'inline-block' ? 'inline-block' : 'block';
                    wrapper.style.width = element.offsetWidth + 'px';
                    wrapper.style.height = element.offsetHeight + 'px';

                    Dom.wrap(element, wrapper, editor);
                    let iframe = element;

                    editor.events.on(wrapper, 'changesize', () => {
                        iframe.setAttribute('width', wrapper.offsetWidth + 'px');
                        iframe.setAttribute('height', wrapper.offsetHeight + 'px');
                    });
                    element = wrapper;
                }
            }

            editor
                .__on(element, 'dragstart', hideResizer)
                .__on(element, 'mousedown', (event: MouseEvent) => {
                    // for IE don't show native resizer
                    if (isIE()) {
                        event.preventDefault();
                    }
                })
                .__on(element, 'click', () => {
                    currentElement = element;
                    showResizer();
                    if (currentElement.tagName === 'IMG' && !(<HTMLImageElement>currentElement).complete) {
                        currentElement.addEventListener('load', function ElementOnLoad() {
                            updateSize();
                            currentElement.removeEventListener('load', ElementOnLoad);
                        });
                    }
                });
        };

    // resizeElement = {};

    $$('i', resizer).forEach((resizeHandle: HTMLElement) => {
        editor.__on(resizeHandle, 'mousedown', (e: MouseEvent) => {
            if (!currentElement || !currentElement.parentNode) {
                hideResizer();
                return false;
            }

            // resizeElementClicked = false;
            handle = resizeHandle;

            e.preventDefault();
            e.stopImmediatePropagation();

            width = currentElement.offsetWidth;
            height = currentElement.offsetHeight;
            ratio = width / height;

            // clicked = true;
            isResizing = true;
            // resized = false;

            start_x = e.clientX;
            start_y = e.clientY;
        });
    });


    editor
        .__on(window, 'mousemove', (e: MouseEvent) => {
            if (isResizing) {
                // resized = true;

                diff_x = e.clientX - start_x;
                diff_y = e.clientY - start_y;

                if ('IMG' === currentElement.tagName) {
                    if (diff_x) {
                        new_w = width + (handle.className.match(/left/) ? -1 : 1)  * diff_x;
                        new_h = Math.round(new_w / ratio);
                    } else {
                        new_h = height + (handle.className.match(/top/) ? -1 : 1)  * diff_y;
                        new_w = Math.round(new_h * ratio);
                    }
                } else {
                    new_w = width + (handle.className.match(/left/) ? -1 : 1)  * diff_x;
                    new_h = height + (handle.className.match(/top/) ? -1 : 1)  * diff_y;
                }

                if (new_w > editor.options.resizer.min_width) {
                    if (new_w < (<HTMLElement>resizer.parentNode).offsetWidth) {
                        currentElement.style.width = new_w + 'px';
                    } else {
                        currentElement.style.width = '100%';
                    }
                }

                if (new_h > editor.options.resizer.min_height) {
                    currentElement.style.height = new_h + 'px';
                }

                updateSize();
                e.stopImmediatePropagation();
            }
        })
        .__on(window, 'resize', () => {
            if (resizerIsVisible) {
                updateSize();
            }
        })
        .__on(window, 'mouseup keydown', (e: MouseEvent) => {
            if (resizerIsVisible) {
                if (isResizing) {
                    isResizing = false;
                    e.stopImmediatePropagation();
                } else {
                    hideResizer()
                }
            }
        });

    editor.__on([window, editor.editor], 'scroll', () => {
        if (resizerIsVisible && !isResizing) {
            hideResizer()
        }
    });


    editor.events.on('change afterInit afterSetMode', () => {
        if (resizerIsVisible && (!currentElement || !currentElement.parentNode)) {
            hideResizer();
        }
        $$('img, table, iframe', editor.editor).forEach((elm: HTMLElement) => {
            if (!elm['__jodit_resizer_binded'] && ((elm.tagName === 'IFRAME' && editor.options.useIframeResizer) || (elm.tagName === 'IMG' && editor.options.useImageResizer) || (elm.tagName === 'TABLE' && editor.options.useTableResizer))) {
                elm['__jodit_resizer_binded'] = true;
                bind(elm);
            }
        });
    });

    editor.container.appendChild(resizer);
};
