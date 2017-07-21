import Jodit from '../Jodit';
import {Config} from '../Config'
import {$$, browser, dom, offset} from '../modules/Helpers'

/**
 * The module creates a supporting frame for resizing of the elements img and table
 * @module Resizer
 * @params {Object} parent Jodit main object
 */
/**
 * @prop {boolean} useIframeResizer=true Use true frame for editing iframe size. Uses in  {@link module:Resizer|Resizer} module
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
 * @prop {boolean} useTableResizer=true Use true frame for editing table size. Uses in  {@link module:Resizer|Resizer} module
 * @memberof Jodit.defaultOptions
 */
Config.prototype.useTableResizer = true

/**
 * @prop {boolean} useImageResizer=true Use true image editing frame size. Uses in  {@link module:Resizer|Resizer} module
 * @memberof Jodit.defaultOptions
 */
Config.prototype.useImageResizer = true
/**
 * @prop {object} resizer module Settings {@link module:Resizer|Resizer}
 * @prop {int} resizer.min_width=10 The minimum width for the editable element
 * @prop {int} resizer.min_height=10 The minimum height for the item being edited
 * @memberof Jodit.defaultOptions
 */
Config.prototype.resizer = {
    min_width : 10,
    min_height : 10
}

Jodit.plugins.resizer = function (editor: Jodit) {
    let clicked = false,
        resized = false,
        target: HTMLElement,
        start_x: number,
        start_y: number,
        width: number,
        height: number,
        ratio: number,
        new_h: number,
        new_w: number,
        diff_x: number,
        diff_y: number,
        timeouts = [],
        resizer: HTMLElement = dom('<div style="display:none" class="jodit_resizer">' +
                '<i class="jodit_resizer-topleft"></i>' +
                '<i class="jodit_resizer-topright"></i>' +
                '<i class="jodit_resizer-bottomright"></i>' +
                '<i class="jodit_resizer-bottomleft"></i>' +
            '</div>'),

        resizerIsVisible: boolean = false,

        hideResizer = () => {
            resizerIsVisible = false;
            resizer.style.display = 'none';
            if (resizer['$element'] && resizer['$element'].hasAttribute('unselectable')) {
                resizer['$element'].removeAttribute('unselectable');
            }
        },
        showResizer = () => {
            resizerIsVisible = true;
            resizer.style.display = 'block';
        },

        /**
         * Bind an edit element to element
         * @method bind
         * @param {HTMLElement} $element The element that you want to add a function to resize
         */
        bind = (element: HTMLElement) => {
            let wrapper: HTMLElement;
            if (element.tagName === 'IFRAME') {
                if (element.parentNode && (<HTMLElement>element.parentNode).classList.contains('jodit_iframe_wrapper')) {
                    element = <HTMLElement>element.parentNode;
                } else {
                    wrapper = dom('<div data-jodit-temp="1" contenteditable="false" draggable="true" class="jodit_iframe_wrapper"></div>');

                    wrapper.style.display = element.style.display === 'inline-block' ? 'inline-block' : 'block';
                    wrapper.style.width = element.offsetWidth + 'px';
                    wrapper.style.height = element.offsetHeight + 'px';

                    editor.node.wrap(element, wrapper);
                    let iframe = element;

                    editor.events.on(wrapper, 'changesize', () => {
                        iframe.setAttribute('width', wrapper.offsetWidth + 'px')
                        iframe.setAttribute('height', wrapper.offsetHeight + 'px')
                    });
                    element = wrapper;
                }
            }

            editor.
                __off(element, '.jodit-resizer')
                .__on(element, 'drag.jodit-resizer', (e) => {
                    hideResizer()
                })
                .__on(element, 'mousedown.jodit-resizer', (e: MouseEvent) => {
                   // if (browser('msie')) {
                        //element.setAttribute('unselectable', 'on');
                   // }
                    element['clicked'] = true;
                    e.preventDefault();
                })
                .__on(element, 'mouseup.jodit-resizer', (e) => {
                    if (element['clicked']) {
                        timeouts.push(setTimeout(() => {
                            element['clicked'] = false;
                            resizer['$element'] = element;
                            showResizer();
                            editor.events.fire(resizer, 'updatesize');
                        }, 50));
                    }
                });
        };

    resizer['$element'] = {};

    $$('i', resizer).forEach((handle: HTMLElement) => {
        editor.__on(handle, 'mousedown', (e) => {
            if (!resizer['$element'] || !resizer['$element'].parentNode) {
                hideResizer();
                return false;
            }

            resizer['$element']['clicked'] = false;
            target = e.target || e.srcElement;
            e.preventDefault();
            e.stopImmediatePropagation();

            width = parseInt(resizer['$element'].offsetWidth, 10);
            height = parseInt(resizer['$element'].offsetHeight, 10);
            ratio = width / height;

            clicked = true;
            resized = false;

            start_x = parseInt(e.clientX, 10);
            start_y = parseInt(e.clientY, 10);
        });
    })


    editor
        .__on(editor.win, 'mousemove.jodit-resizer' + editor.id, (e) => {
            if (clicked) {
                resized = true;

                diff_x = parseInt(e.clientX, 10) - start_x;
                diff_y = parseInt(e.clientY, 10) - start_y;

                if ('IMG' === resizer['$element'].tagName) {
                    if (diff_x) {
                        new_w = width + (target.className.match(/left/) ? -1 : 1)  * diff_x;
                        new_h = Math.round(new_w / ratio);
                    } else {
                        new_h = height + (target.className.match(/top/) ? -1 : 1)  * diff_y;
                        new_w = Math.round(new_h * ratio);
                    }
                } else {
                    new_w = width + (target.className.match(/left/) ? -1 : 1)  * diff_x;
                    new_h = height + (target.className.match(/top/) ? -1 : 1)  * diff_y;
                }

                if (new_w > editor.options.resizer.min_width) {
                    if (new_w < (<HTMLElement>resizer.parentNode).offsetWidth) {
                        resizer['$element'].style.width = new_w + 'px';
                    } else {
                        resizer['$element'].style.width = '100%';
                    }
                }

                if (new_h > editor.options.resizer.min_height) {
                    resizer['$element'].style.height = new_h + 'px';
                }

                editor.events.fire(resizer, 'updatesize');
                e.stopImmediatePropagation();
            }
        })
        .__on(editor.win, 'resize.jodit-resizer' + editor.id + ' updateresizer.jodit-resizer', (e) => {
            if (resizerIsVisible) {
                editor.events.fire(resizer, 'updatesize');
            }
        })
        .__on(editor.win, 'mouseup.jodit-resizer' + editor.id + ' keydown.jodit-resizer', (e) => {
            if (resizerIsVisible) {
                if (clicked) {
                    if (resized) {
                        editor.setEditorValue();
                    }
                    clicked = false;
                    resized = false;
                    e.stopImmediatePropagation();
                } else {
                    if (!resizer['$element']['clicked'] || !(resizer['$element'].length && resizer['$element'].parent().length)) {
                        hideResizer()
                    }
                }
            }
        });

    editor.__on(editor.editor, 'scroll.jodit-resizer' + editor.id, () => {
        if (resizerIsVisible) {
            hideResizer()
        }
    });

    editor.events.on(resizer, 'updatesize', () => {
        if (resizerIsVisible) {
            const pos = offset(resizer['$element']);
            // 1 - because need move border higher and to the left than the picture
            // 2 - in box-sizing: border-box mode width is real width indeferent by border-width.
            resizer.style.top = (pos.top - 1) + 'px';
            resizer.style.left = (pos.left - 1) + 'px';
            resizer.style.width = (resizer['$element'].offsetWidth) + 'px';
            resizer.style.height = (resizer['$element'].offsetHeight) + 'px';

            editor.events.fire(resizer['$element'], 'changesize');
        }
    });

    editor.events.on(editor, 'beforeDestruct', () => {
        timeouts.forEach((timeout) => {
            clearTimeout(timeout);
        })
    });

    editor.container.appendChild(resizer);

    editor.events.on('change', () => {
        if (resizerIsVisible && (!resizer['$element'] || !resizer['$element'].parentNode)) {
            hideResizer();
        }
        $$('img, table, iframe', editor.editor).forEach((elm: HTMLElement) => {
            if (!elm['__jodit_resizer_binded'] && (elm.tagName === 'IFRAME' && editor.options.useIframeResizer) || (elm.tagName === 'IMG' && editor.options.useImageResizer) || (elm.tagName === 'TABLE' && editor.options.useTableResizer)) {
                elm['__jodit_resizer_binded'] = true;
                bind(elm);
            }
        });
    });
};
