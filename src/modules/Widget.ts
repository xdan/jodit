import Component from './Component'
import Jodit from '../Jodit'
import {normalizeColor, dom, isPlainObject, each, $$, hexToRgb, val} from './Helpers'
import Dom from "./Dom";

export default class Widget extends Component {
    /**
     * @property {HTMLElement} container
     */
    container;

    /**
     *
     * @param {String} name
     * @param {Object|Function} [options]
     * @param {Object|Function|String|Number} [defaultValue]
     * @return {HTMLElement}
     */
    create(name, options:any = {}, defaultValue?: any) {
        if (Widget[name]) {
            const widget = new Widget[name](this.parent, options, defaultValue);
            widget.container.classList.add('jodit_widget');
            return widget.container;
        }
        return document.createElement('div');
    }
}

/**
 * Build color picker
 *
 * @param {function} callback Callback 'function (color) {}'
 * @param {string} [value] Color value ex. #fff or rgb(123, 123, 123) or rgba(123, 123, 123, 1)
 * @example
 * let widget = new Jodit.modules.Widget(editor);
 *
 * $tabs = widget.create('Tabs', {
 *    'Text' : widget.create('ColorPicker', function (color) {
 *         box.style.color = color;
 *     }, box.style.color),
 *     'Background' : widget.create('ColorPicker', function (color) {
 *         box.style.backgroundColor = color;
 *     }, box.style.backgroundColor),
 * });
 */
Widget['ColorPicker'] = class extends Widget{
    constructor(parent: Jodit, callback, value) {
        super(parent);
        const valueHex = normalizeColor(value),
            form = dom('<div class="jodit_colorpicker"></div>'),
            eachColor = (colors) => {
                let stack = [];
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
            .appendChild(dom('<div>'  + eachColor(parent.options.colors) + '</div>'));

        form.appendChild(dom('<a data-color="" href="javascript:void(0)">' + Jodit.modules.Toolbar.getIcon('eraser') + '</a>'));

        form
            .addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });

        form
            .addEventListener('mousedown', (e) => {
                let target = e.target;

                if (target.tagName.toUpperCase() === 'SVG' || target.tagName.toUpperCase() === 'PATH') {
                    target = Dom.closest(target.parentNode, 'A', this.parent.editor);
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

                    let colorRGB = hexToRgb(color);
                    target.firstChild.style.fill = 'rgb(' + (255 - colorRGB.r) + ',' + (255 - colorRGB.g) + ',' + (255 - colorRGB.b) + ')'
                }


                if (callback && typeof callback === 'function') {
                    callback(color);
                }


                return false;
            });

        this.container = form;
    }
};

/**
 * Build tabs system
 *
 * @param {Object} tabs PlainObject where 'key' will be tab's Title and `value` is tab's content
 *
 * @example
 * let widget = new Jodit.modules.Widget(editor);
 *
 * let tabs = widget.create('Tabs', {
 *    'Images': '<div>Images</div>',
 *    'Title 2': editor.helper.dom('<div>Some content</div>'),
 *    'Color Picker': widget.create('ColorPicker', function (color) {
 *         box.style.color = color;
 *     }, box.style.color),
 * });

 */
Widget['Tabs'] = class extends Widget{
    constructor(parent, options) {
        super(parent);
        let box = dom('<div class="jodit_tabs"></div>'),
            tabs = dom('<div class="jodit_tabs_wrapper"></div>'),
            buttons = dom('<div class="jodit_tabs_buttons"></div>'),
            tabcount = 0;
        
        box.appendChild(buttons);
        box.appendChild(tabs);
        
        each(options, (name, tabOptions) => {
            const tab = dom('<div class="jodit_tab"></div>'),
                button = dom('<a href="javascript:void(0);"></a>');

            button.innerHTML = parent.i18n(name);
            buttons.appendChild(button);

            if (typeof tabOptions !== 'function') {
                tab.appendChild(dom(tabOptions));
            } else {
                tab.appendChild(dom('<div class="jodit_tab_empty"></div>'));
            }
            tabs.appendChild(tab);
            button.addEventListener('mousedown', (e) => {
                $$('a', buttons).forEach((a) => {
                    a.classList.remove('active');
                });
                $$('.jodit_tab', tabs).forEach((a) => {
                    a.classList.remove('active');
                });

                button.classList.add('active');
                tab.classList.add('active');
                if (typeof tabOptions === 'function') {
                    tabOptions.call(parent);
                }
                e.stopPropagation();
                return false;
            });
            tabcount += 1;
        });
        if (!tabcount) {
            return;
        }

        $$('a', buttons).forEach((a) => {
            a.style.width = (100 / tabcount).toFixed(10) + '%';
        });

        buttons.querySelector('a:first-child').classList.add('active');
        tabs.querySelector('.jodit_tab:first-child').classList.add('active');
        this.container = box;
    }
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
 */
Widget['ImageSelector'] = class extends Widget{
    currentImage: any;
    constructor(editor, callbacks, elm) {
        super(editor);

        let tabs:{[key: string]: HTMLElement|Function} = {},
            dragbox: HTMLElement,
            form: HTMLFormElement;

        if (callbacks.upload && editor.options.uploader && editor.options.uploader.url) {
            dragbox = dom('<div class="jodit_draganddrop_file_box">' +
                '<strong>' + editor.i18n('Drop image') + '</strong>' +
                '<span><br> ' + editor.i18n('or click') + '</span>' +
                '<input type="file" accept="image/*" tabindex="-1" dir="auto" multiple=""/>' +
                '</div>');

            editor.getInstance('Uploader').bind(dragbox, (images) => {
                if (typeof(callbacks.upload) === 'function') {
                    callbacks.upload.call(editor, images);
                }
            }, (resp) => {
                editor.events.fire('errorMessage', [editor.options.uploader.getMessage(resp)]);
            });

            tabs[Jodit.modules.Toolbar.getIcon('upload') + editor.i18n('Upload')] = dragbox;
        }

        if (callbacks.filebrowser) {
            if (editor.options.filebrowser.url || editor.options.filebrowser.ajax.url || editor.options.filebrowser.items.url) {
                tabs[Jodit.modules.Toolbar.getIcon('folder') + editor.i18n('Browse')] = function () {
                    editor.getInstance('FileBrowser').open(callbacks.filebrowser);
                };
            }
        }

        if (callbacks.url) {
            form = dom('<form onsubmit="return false;" class="jodit_form">' +
                '<input required name="url" placeholder="http://"/>' +
                '<input name="text" placeholder="' + editor.i18n('Alternative text') + '"/>' +
                '<div style="text-align: right">' +
                    '<button>' + editor.i18n('Insert') + '</button>' +
                '</div>' +
            '</form>');

            this.currentImage = null;

            if (elm && elm.nodeType !== Node.TEXT_NODE && (elm.tagName === 'IMG' || $$('img', elm).length)) {
                this.currentImage = elm.tagName === 'IMG' ? elm : $$('img', elm)[0];
                val(form, 'input[name=url]', this.currentImage.getAttribute('src'));
                val(form, 'input[name=text]', this.currentImage.getAttribute('alt'));
                form.querySelector('button').innerText = editor.i18n('Update');
            }

            form.addEventListener('submit', (event: Event) => {
                event.preventDefault();
                event.stopPropagation();

                if (!val(form, 'input[name=url]')) {
                    (<HTMLInputElement>form.querySelector('input[name=url]')).focus();
                    form.querySelector('input[name=url]').classList.add('jodit_error');
                    return false;
                }
                if (typeof(callbacks.url) === 'function') {
                    callbacks.url.call(editor, val(form, 'input[name=url]'), val(form, 'input[name=text]'));
                }
                return false;
            }, false);

            tabs[Jodit.modules.Toolbar.getIcon('link') + ' URL'] = form;

        }

        this.container = this.create('Tabs', tabs);
    }
};
