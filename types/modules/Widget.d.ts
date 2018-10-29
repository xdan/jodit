/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Jodit } from '../Jodit';
import { FileBrowserCallBackData } from "./filebrowser/type";
export declare namespace Widget {
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
    const ColorPickerWidget: (editor: Jodit, callback: (newColor: string) => void, coldColor: string) => HTMLDivElement;
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
    const TabsWidget: (editor: Jodit, tabs: {
        [key: string]: string | Function | HTMLElement;
    }, state?: {
        __activeTab: string;
    } | undefined) => HTMLDivElement;
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
        filebrowser?: (data: FileBrowserCallBackData) => void;
        upload?: (this: Jodit, data: FileBrowserCallBackData) => void;
    };
    /**
     *
     * @param {Jodit} editor
     * @param {Widget.ImageSelectorCallbacks} callbacks
     * @param {HTMLElement} elm
     * @param {Function} close Close popup
     * @param {boolean} isImage
     * @return {HTMLDivElement}
     * @constructor
     */
    const FileSelectorWidget: (editor: Jodit, callbacks: ImageSelectorCallbacks, elm: HTMLElement | null, close: Function, isImage?: boolean) => HTMLDivElement;
}
