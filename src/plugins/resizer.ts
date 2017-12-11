/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit from '../Jodit';
import {Config} from '../Config'
import * as consts from '../constants'
import {$$, debounce, dom, isIE, offset} from '../modules/Helpers'

/**
 * The module creates a supporting frame for resizing of the elements img and table
 * @module Resizer
 * @params {Object} parent Jodit main object
 */
/**
 * @property{boolean} useIframeResizer=true Use true frame for editing iframe size
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
 * @property{boolean} useTableResizer=true Use true frame for editing table size
 */
Config.prototype.useTableResizer = true;

/**
 * @property{boolean} useImageResizer=true Use true image editing frame size
 */
Config.prototype.useImageResizer = true;
/**
 * @property{object} resizer
 * @property{int} resizer.min_width=10 The minimum width for the editable element
 * @property{int} resizer.min_height=10 The minimum height for the item being edited
 */
Config.prototype.resizer = {
    min_width : 10,
    min_height : 10
};

export default function (editor: Jodit) {
    // let clicked = false,
    //     resized = false,
    const LOCK_KEY = 'resizer';
    let
        handle: HTMLElement,

        currentElement: null|HTMLElement,
        resizeElementClicked: boolean = false,
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

    const resizer: HTMLElement = dom('<div data-editor_id="' + editor.id + '" style="display:none" class="jodit_resizer">' +
            '<i class="jodit_resizer-topleft"></i>' +
            '<i class="jodit_resizer-topright"></i>' +
            '<i class="jodit_resizer-bottomright"></i>' +
            '<i class="jodit_resizer-bottomleft"></i>' +
        '</div>', editor.ownerDocument),

        hideResizer = () => {
            isResizing = false;
            resizerIsVisible = false;
            currentElement = null;
            resizer.style.display = 'none';
        },

        updateSize = () => {
            if (resizerIsVisible) {
                const pos = offset(currentElement, editor),
                    left: number = parseInt(resizer.style.left, 10),
                    top: number = parseInt(resizer.style.top, 10),
                    width: number = resizer.offsetWidth,
                    height: number = resizer.offsetHeight;

                // 1 - because need move border higher and toWYSIWYG the left than the picture
                // 2 - in box-sizing: border-box mode width is real width indifferent by border-width.
                if (top !== pos.top - 1 || left !== pos.left - 1 || width !== currentElement.offsetWidth || height !== currentElement.offsetHeight) {
                    resizer.style.top = (pos.top - 1) + 'px';
                    resizer.style.left = (pos.left - 1) + 'px';
                    resizer.style.width = currentElement.offsetWidth + 'px';
                    resizer.style.height = currentElement.offsetHeight + 'px';

                    if (editor.events) {
                        editor.events.fire(currentElement, 'changesize');

                        // check for first init. Ex. inlinePopup hides when it was fired
                        if (!isNaN(left)) {
                            editor.events.fire('resize');
                        }
                    }
                }
            }
        },

        showResizer = () => {
            resizerIsVisible = true;
            resizer.style.display = 'block';
            updateSize();
        },



        /**
         * Bind an edit element toWYSIWYG element
         * @param {HTMLElement} element The element that you want toWYSIWYG add a function toWYSIWYG resize
         */
        bind = (element: HTMLElement) => {
            let wrapper: HTMLElement;
            if (element.tagName === 'IFRAME') {
                if (element.parentNode && (<HTMLElement>element.parentNode).getAttribute('data-jodit_iframe_wrapper')) {
                    element = <HTMLElement>element.parentNode;
                } else {
                    wrapper = dom('<jodit data-jodit-temp="1" contenteditable="false" draggable="true" data-jodit_iframe_wrapper="1"></jodit>', editor.editorDocument);

                    wrapper.style.display = element.style.display === 'inline-block' ? 'inline-block' : 'block';
                    wrapper.style.width = element.offsetWidth + 'px';
                    wrapper.style.height = element.offsetHeight + 'px';

                    element.parentNode.insertBefore(wrapper, element);
                    wrapper.appendChild(element);

                    let iframe = element;

                    editor.events.on(wrapper, 'changesize', () => {
                        iframe.setAttribute('width', wrapper.offsetWidth + 'px');
                        iframe.setAttribute('height', wrapper.offsetHeight + 'px');
                    });
                    element = wrapper;
                }
            }

            let timer;
            editor
                .__on(element, 'dragstart', hideResizer)
                .__on(element, 'mousedown', (event: MouseEvent) => {
                    // for IE don't show native resizer
                    if (isIE()) {
                        event.preventDefault();
                    }
                })
                .__on(element, 'mousedown touchstart', () => {

                    if (!resizeElementClicked) {
                        resizeElementClicked = true;
                        currentElement = element;
                        showResizer();
                        if (currentElement.tagName === 'IMG' && !(<HTMLImageElement>currentElement).complete) {
                            currentElement.addEventListener('load', function ElementOnLoad() {
                                updateSize();
                                if (currentElement) {
                                    currentElement.removeEventListener('load', ElementOnLoad);
                                }
                            });
                        }
                        clearTimeout(timer);
                    }

                    timer = setTimeout(() => {
                        resizeElementClicked = false;
                    }, 400);
                });
        };

    // resizeElement = {};

    $$('i', resizer).forEach((resizeHandle: HTMLElement) => {
        editor.__on(resizeHandle, 'mousedown touchstart', (e: MouseEvent) => {
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
            editor.lock(LOCK_KEY);
        });
    });

    editor.events
        .on('beforeDestruct', () => {
            if (resizer.parentNode) {
                resizer.parentNode.removeChild(resizer);
            }
        })
        .on('afterInit', () => {
            editor.editorDocument.body.appendChild(resizer);
            editor
                .__on(editor.editor, 'keydown', (e: KeyboardEvent) => {
                    if (resizerIsVisible && e.keyCode === consts.KEY_DELETE && currentElement && currentElement.tagName.toLowerCase() !== 'table') {
                        if (currentElement.tagName !== 'JODIT') {
                            editor.selection.select(currentElement);
                        } else {
                            currentElement.parentNode.removeChild(currentElement);
                            hideResizer();
                            e.preventDefault();
                        }
                    }
                })
                .__on(editor.ownerWindow, 'mousemove touchmove', (e: MouseEvent) => {
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
                .__on(editor.ownerWindow, 'resize', () => {
                    if (resizerIsVisible) {
                        updateSize();
                    }
                })
                .__on(editor.ownerWindow, 'mouseup keydown touchend', (e: MouseEvent) => {
                    if (resizerIsVisible && !resizeElementClicked) {
                        if (isResizing) {
                            editor.unlock();
                            isResizing = false;
                            editor.setEditorValue();
                            e.stopImmediatePropagation();
                        } else {
                            hideResizer()
                        }
                    }
                });

            editor.__on([editor.ownerWindow, editor.editor], 'scroll', () => {
                if (resizerIsVisible && !isResizing) {
                    hideResizer()
                }
            });
        })
        .on('afterGetValueFromEditor', (data: {value: string}) => {
            data.value = data.value.replace(/<jodit[^>]+data-jodit_iframe_wrapper[^>]+>(.*?<iframe[^>]+>[\s\n\r]*<\/iframe>.*?)<\/jodit>/ig, '$1');
        }).on('change afterInit afterSetMode', debounce(() => {
            if (resizerIsVisible) {
                if (!currentElement || !currentElement.parentNode) {
                    hideResizer();
                } else {
                    updateSize();
                }
            }

            $$('img, table, iframe', editor.editor).forEach((elm: HTMLElement) => {
                if (editor.getMode() === consts.MODE_SOURCE) {
                    return;
                }
                if (!elm['__jodit_resizer_binded'] && ((elm.tagName === 'IFRAME' && editor.options.useIframeResizer) || (elm.tagName === 'IMG' && editor.options.useImageResizer) || (elm.tagName === 'TABLE' && editor.options.useTableResizer))) {
                    elm['__jodit_resizer_binded'] = true;
                    bind(elm);
                }
            });
        }, editor.options.observer.timeout));
};
