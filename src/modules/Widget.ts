/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit'
import {normalizeColor, dom, isPlainObject, each, $$, hexToRgb, val} from './Helpers'
import {Dom} from "./Dom";
import {Uploader, UploaderData} from "./Uploader";
import {FileBrowser, FileBrowserCallBcackData} from "./FileBrowser";

export namespace Widget {

    /**
     * Build color picker
     *
     * @param {Jodit} editor
     * @param {function} callback Callback 'function (color) {}'
     * @param {string} [coldColor] Color value ex. #fff or rgb(123, 123, 123) or rgba(123, 123, 123, 1)
     * @example
     * ```javascript
     * $tabs = TabsWidget(editor, {
     *    'Text' : ColorPickerWidget(editor, function (color) {
     *         box.style.color = color;
     *     }, box.style.color),
     *     'Background' : ColorPickerWidget(editor, function (color) {
     *         box.style.backgroundColor = color;
     *     }, box.style.backgroundColor),
     * });
     * ```
     */
    export const ColorPickerWidget = (editor: Jodit, callback: (newColor: string) => void, coldColor: string): HTMLDivElement => {
        const valueHex = normalizeColor(coldColor),
            form: HTMLDivElement = <HTMLDivElement>dom('<div class="jodit_colorpicker"></div>', editor.ownerDocument),
            eachColor = (colors) => {
                const stack: string[] = [];
                if (isPlainObject(colors)) {
                    Object.keys(colors).forEach((key) => {
                        stack.push('<div class="jodit_colorpicker_group jodit_colorpicker_group-' + key + '">');
                        stack.push(eachColor(colors[key]));
                        stack.push('</div>');
                    })
                } else if (Array.isArray(colors)) {
                    colors.forEach((color) => {
                        stack.push('<a ' + (valueHex === color ? ' class="active" ' : '') + ' title="' + color + '" style="background-color:' + color + '" data-color="' + color + '" href="javascript:void(0)">' +
                            (valueHex === color ? Jodit.modules.Toolbar.getIcon('eye') : '') +
                            '</a>');
                    })
                }
                return stack.join('');
            };


        form
            .appendChild(dom('<div>' + eachColor(editor.options.colors) + '</div>', editor.ownerDocument));

        form.appendChild(dom('<a data-color="" href="javascript:void(0)">' + Jodit.modules.Toolbar.getIcon('eraser') + '</a>', editor.ownerDocument));

        editor
            .__on(form, 'mousedown touchstart', (e: MouseEvent) => {
                e.stopPropagation();
                let target: HTMLElement = <HTMLElement>e.target;

                if ((target.tagName.toUpperCase() === 'SVG' || target.tagName.toUpperCase() === 'PATH') && target.parentNode) {
                    target = <HTMLElement>Dom.closest(target.parentNode, 'A', editor.editor);
                }
                if (target.tagName.toUpperCase() !== 'A') {
                    console.log(target.tagName.toUpperCase());
                    return;
                }


                const active = form.querySelector('a.active');
                if (active) {
                    active.classList
                        .remove('active');
                    active.innerHTML = '';
                }

                let color = target.getAttribute('data-color') || '';


                if (color) {
                    target.innerHTML = Jodit.modules.Toolbar.getIcon('eye');
                    target.classList.add('active');

                    const colorRGB: RGB|null = hexToRgb(color);
                    if (colorRGB) {
                        (<HTMLElement>target.firstChild).style.fill = 'rgb(' + (255 - colorRGB.r) + ',' + (255 - colorRGB.g) + ',' + (255 - colorRGB.b) + ')'
                    }
                }


                if (callback && typeof callback === 'function') {
                    callback(color);
                }


                e.preventDefault();
            });


        return form;
    };

    /**
     * Build tabs system
     *
     * @param {Jodit} editor
     * @param {object} tabs PlainObject where 'key' will be tab's Title and `value` is tab's content
     * @param {object} state You can use for this param any HTML element for remembering active tab
     * @param {string} state.activeTab
     *
     * @example
     * ```javascript
     * let tabs = widget.create('Tabs', {
     *    'Images': '<div>Images</div>',
     *    'Title 2': editor.helper.dom('<div>Some content</div>'),
     *    'Color Picker': ColorPickerWidget(editor, function (color) {
     *         box.style.color = color;
     *     }, box.style.color),
     * });
     * ```
     */
    export const TabsWidget = (editor: Jodit, tabs: {[key: string]: string|HTMLElement|Function}, state?: {__activeTab: string}): HTMLDivElement => {
        let box: HTMLDivElement = <HTMLDivElement>dom('<div class="jodit_tabs"></div>', editor.ownerDocument),
            tabBox: HTMLDivElement = <HTMLDivElement>dom('<div class="jodit_tabs_wrapper"></div>', editor.ownerDocument),
            buttons: HTMLDivElement = <HTMLDivElement>dom('<div class="jodit_tabs_buttons"></div>', editor.ownerDocument),
            nameToTab: {[key: string]: {
                button: HTMLDivElement,
                tab: HTMLDivElement
            }} = {},
            firstTab: string = '',
            tabcount: number = 0;

        box.appendChild(buttons);
        box.appendChild(tabBox);

        each(tabs, (name: string, tabOptions: Function|HTMLElement) => {
            const tab: HTMLDivElement = <HTMLDivElement>dom('<div class="jodit_tab"></div>', editor.ownerDocument),
                button: HTMLDivElement = <HTMLDivElement>dom('<a href="javascript:void(0);"></a>', editor.ownerDocument);

            if (!firstTab) {
                firstTab = name;
            }

            button.innerHTML = editor.i18n(name);
            buttons.appendChild(button);

            if (typeof tabOptions !== 'function') {
                tab.appendChild(dom(tabOptions, editor.ownerDocument));
            } else {
                tab.appendChild(dom('<div class="jodit_tab_empty"></div>', editor.ownerDocument));
            }

            tabBox.appendChild(tab);

            editor.__on(button, 'mousedown touchstart', (e: MouseEvent) => {
                $$('a', buttons).forEach((a) => {
                    a.classList.remove('active');
                });
                $$('.jodit_tab', tabBox).forEach((a) => {
                    a.classList.remove('active');
                });

                button.classList.add('active');
                tab.classList.add('active');
                if (typeof tabOptions === 'function') {
                    tabOptions.call(editor);
                }
                e.stopPropagation();

                if (state) {
                    state.__activeTab = name;
                }

                return false;
            });

            nameToTab[name] = {
                button,
                tab,
            };

            tabcount += 1;
        });

        if (!tabcount) {
            return box;
        }

        $$('a', buttons).forEach((a) => {
            a.style.width = (100 / tabcount).toFixed(10) + '%';
        });

        if (!state || !state.__activeTab || !nameToTab[state.__activeTab]) {
            nameToTab[firstTab].button.classList.add('active');
            nameToTab[firstTab].tab.classList.add('active');
        } else {
            nameToTab[state.__activeTab].button.classList.add('active');
            nameToTab[state.__activeTab].tab.classList.add('active');
        }

        return box;
    };

    /**
     * Generate 3 tabs
     * upload - Use Drag and Drop
     * url - By specifying the image url
     * filebrowser - After opening the file browser . In the absence of one of the parameters will be less tabs
     *
     * @params {Object} callbacks Object with keys `url`, `upload` and `filebrowser`, values which are callback functions with different parameters
     * @param {Function} callbacks.upload - function that will be called when the user selects a file or using drag and drop files to the `Upload` tab
     * @param {Function} callbacks.url - function that will be called when the user enters the URL of the tab image and alternative text for images
     * @param {Function} callbacks.filebrowser - function that will be called when the user clicks on the file browser tab, and then choose any image in the window that opens, faylbrauzera
     * @params {HTMLNode} image image object
     * @example
     * ```javascript
     * let widget = new Jodit.modules.Widget(editor);
     *
     * return widget.create('ImageSelector', {
     *      url: function (url, alt) {
     *          editor.selections.insertImage(url);
     *      },
     *      upload: function (images) {
     *          editor.selections.insertImage(images[0]);
     *      },
     *      filebrowser: function (images) {
     *          editor.selections.insertImage(images[0]);
     *      }
     * }, image);
     * ```
     */

    type ImageSelectorCallbacks = {
        url?: (this: Jodit, url: string, alt: string) => void;
        filebrowser?: (data: FileBrowserCallBcackData) => void,
        upload?: (this: Jodit, data: FileBrowserCallBcackData) => void;
    };

    /**
     *
     * @param {Jodit} editor
     * @param {Widget.ImageSelectorCallbacks} callbacks
     * @param {HTMLElement} elm
     * @param {Function} close Close popup
     * @return {HTMLDivElement}
     * @constructor
     */
    export const ImageSelectorWidget = (editor: Jodit, callbacks: ImageSelectorCallbacks, elm: HTMLElement, close: Function): HTMLDivElement =>{
        let currentImage: any;
        const tabs: { [key: string]: HTMLElement | Function } = {};

        if (callbacks.upload && editor.options.uploader && editor.options.uploader.url) {
            const dragbox: HTMLElement = dom('<div class="jodit_draganddrop_file_box">' +
                    '<strong>' + editor.i18n('Drop image') + '</strong>' +
                    '<span><br> ' + editor.i18n('or click') + '</span>' +
                    '<input type="file" accept="image/*" tabindex="-1" dir="auto" multiple=""/>' +
                '</div>', editor.ownerDocument);

            (<Uploader>editor.getInstance('Uploader')).bind(dragbox, (resp: UploaderData) => {
                if (typeof(callbacks.upload) === 'function') {
                    callbacks.upload.call(editor, {
                        baseurl: resp.baseurl,
                        files: resp.files
                    });
                }
            }, (error: Error) => {
                editor.events.fire('errorMessage', [error.message]);
            });

            tabs[Jodit.modules.Toolbar.getIcon('upload') + editor.i18n('Upload')] = dragbox;
        }

        if (callbacks.filebrowser) {
            if (editor.options.filebrowser.ajax.url || editor.options.filebrowser.items.url) {
                tabs[Jodit.modules.Toolbar.getIcon('folder') + editor.i18n('Browse')] = function () {
                    close && close();
                    if (callbacks.filebrowser) {
                        (<FileBrowser>editor.getInstance('FileBrowser')).open(callbacks.filebrowser);
                    }
                };
            }
        }

        if (callbacks.url) {
            const form: HTMLFormElement = <HTMLFormElement>dom('<form onsubmit="return false;" class="jodit_form">' +
                    '<input type="text" required name="url" placeholder="http://"/>' +
                    '<input type="text" name="text" placeholder="' + editor.i18n('Alternative text') + '"/>' +
                    '<div style="text-align: right">' +
                        '<button>' + editor.i18n('Insert') + '</button>' +
                    '</div>' +
                '</form>', editor.ownerDocument),
                button: HTMLButtonElement = <HTMLButtonElement>form.querySelector('button'),
                url: HTMLInputElement = <HTMLInputElement>form.querySelector('input[name=url]');

            currentImage = null;

            if (elm && elm.nodeType !== Node.TEXT_NODE && (elm.tagName === 'IMG' || $$('img', elm).length)) {
                currentImage = elm.tagName === 'IMG' ? elm : $$('img', elm)[0];
                val(form, 'input[name=url]', currentImage.getAttribute('src'));
                val(form, 'input[name=text]', currentImage.getAttribute('alt'));
                button.innerText = editor.i18n('Update');
            }

            form.addEventListener('submit', (event: Event) => {
                event.preventDefault();
                event.stopPropagation();

                if (!val(form, 'input[name=url]')) {
                    url.focus();
                    url.classList.add('jodit_error');
                    return false;
                }
                if (typeof(callbacks.url) === 'function') {
                    callbacks.url.call(editor, val(form, 'input[name=url]'), val(form, 'input[name=text]'));
                }
                return false;
            }, false);

            tabs[Jodit.modules.Toolbar.getIcon('link') + ' URL'] = form;

        }

        return TabsWidget(editor, tabs);
    }
}
