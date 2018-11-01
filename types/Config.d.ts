/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */
import { Buttons, Controls, ControlType } from "./modules/toolbar/type";
/**
 * Default Editor's Configuration
 **/
export declare class Config {
    license: string;
    preset: string;
    presets: {
        [key: string]: any;
    };
    ownerDocument: Document;
    ownerWindow: Window;
    /**
     * z-index For editor
     */
    zIndex: number;
    /**
     * Change the read-only state of the editor
     * @type {boolean}
     */
    readonly: boolean;
    /**
     * Change the disabled state of the editor
     * @type {boolean}
     */
    disabled: boolean;
    activeButtonsInReadOnly: string[];
    /**
     * For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to move the toolbar Jodit by this amount [more](http://xdsoft.net/jodit/doc/#2.5.57)
     */
    /**
     * Size of icons in the toolbar (can be "small", "middle", "large")
     *
     * @example
     * ```javascript
     * var editor  = new  Jodit(".dark_editor", {
     *      toolbarButtonSize: "small"
     * });
     * ```
     */
    toolbarButtonSize: "small" | "middle" | "large";
    /**
     * Inline editing mode
     *
     * @type {boolean}
     */
    inline: boolean;
    /**
     * Theme (can be "dark")
     * @example
     * ```javascript
     * var editor  = new  Jodit(".dark_editor", {
     *      theme: "dark"
     * });
     * ```
     */
    theme: string;
    /**
     * if set true then the current mode is saved in a cookie , and is restored after a reload of the page
     */
    saveModeInStorage: boolean;
    /**
     * if set true and height !== auto then after reload editor will be have latest height
     */
    saveHeightInStorage: boolean;
    /**
     * Options specifies whether the editor is to have its spelling and grammar checked or not
     * @see {@link http://www.w3schools.com/tags/att_global_spellcheck.asp}
     */
    spellcheck: boolean;
    /**
     * Class name that can be appended to the editor
     *
     * @see {@link Jodit.defaultOptions.iframeCSSLinks|iframeCSSLinks}
     * @see {@link Jodit.defaultOptions.iframeStyle|iframeStyle}
     *
     * @example
     * ```javascript
     * new Jodit('#editor', {
     *    editorCssClass: 'some_my_class'
     * });
     * ```
     * ```html
     * <style>
     * .some_my_class p{
     *    line-height: 16px;
     * }
     * </style>
     * ```
     */
    editorCssClass: false | string;
    /**
     * After all changes in editors for textarea will call change trigger
     *
     * @example
     *  ```javascript
     * var editor = new Jodit('#editor');
     * document.getElementById('editor').addEventListener('change', function () {
     *      console.log(this.value);
     * })
     * ```
     */
    triggerChangeEvent: boolean;
    /**
     * Editor's width
     *
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    width: '100%',
     * })
     * ```
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    width: 600, // equivalent for '600px'
     * })
     * ```
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    width: 'auto', // autosize
     * })
     * ```
     */
    width: number | string;
    minWidth: number | string;
    maxWidth: number | string;
    /**
     * Editor's height
     *
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    height: '100%',
     * })
     * ```
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    height: 600, // equivalent for '600px'
     * })
     * ```
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    height: 'auto', // default - autosize
     * })
     * ```
     */
    height: string | number;
    /**
     * Editor's min-height
     *
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    minHeight: '30%' //min-height: 30%
     * })
     * ```
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    minHeight: 200 //min-height: 200px
     * })
     * ```
     */
    minHeight: number | string;
    /**
     * The writing direction of the language which is used to create editor content. Allowed values are: '' (an empty string) – Indicates that content direction will be the same as either the editor UI direction or the page element direction. 'ltr' – Indicates a Left-To-Right text direction (like in English). 'rtl' – Indicates a Right-To-Left text direction (like in Arabic).
     * @example
     * ```javascript
     * new Jodit('.editor', {
     *    direction: 'rtl'
     * })
     * ```
     */
    direction: string;
    /**
     * Language by default. if `auto` language set by document.documentElement.lang || (navigator.language && navigator.language.substr(0, 2)) || (navigator.browserLanguage && navigator.browserLanguage.substr(0, 2)) || 'en'

     * @example
     * ```html
     * <!-- include in you page lang file -->
     * <script src="jodit/lang/de.js"></script>
     * <script>
     * var editor = new Jodit('.editor', {
     *    language: 'de'
     * });
     * </script>
     * ```
     */
    language: string;
    /**
     * if true all Lang.i18n(key) return `{key}`
     *
     * @example
     * ```html
     * <script>
     * var editor = new Jodit('.editor', {
     *    debugLanguage: true
     * });
     *
     * console.log(editor.i18n("Test")); // {Test}
     * </script>
     * ```
     */
    debugLanguage: boolean;
    /**
     * Collection of language pack data {en: {'Type something': 'Type something', ...}}
     *
     * @example
     * ```javascript
     * var editor = new Jodit('#editor', {
     *     language: 'ru',
     *     i18n: {
     *         ru: {
     *            'Type something': 'Начните что-либо вводить'
     *         }
     *     }
     * });
     * console.log(editor.i18n('Type something')) //Начните что-либо вводить
     * ```
     */
    i18n: {
        [key: string]: any;
    } | string;
    /**
     * The tabindex global attribute is an integer indicating if the element can take input focus (is focusable), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values
     */
    tabIndex: number;
    /**
     * Show toolbar
     */
    toolbar: boolean;
    /**
     * Show tooltip after mouse enter on the button
     */
    showTooltip: boolean;
    /**
     * Delay before show tooltip
     */
    showTooltipDelay: number;
    /**
     * Instead of create custop tooltip - use native title tooltips
     * @type {boolean}
     */
    useNativeTooltip: boolean;
    /**
     * Element that will be created when you press Enter
     */
    enter: "P" | "DIV" | "BR" | "p" | "div" | "br";
    /**
     * Jodit.MODE_WYSIWYG The HTML editor allows you to write like MSWord, Jodit.MODE_AREA syntax highlighting source editor
     * @example
     * ```javascript
     * var editor = new Jodit('#editor', {
     *     defaultMode: Jodit.MODE_SPLIT
     * });
     * console.log(editor.getRealMode())
     * ```
     */
    defaultMode: number;
    /**
     * Use split mode
     *
     * @type {boolean}
     */
    useSplitMode: boolean;
    /**
     * The colors in HEX representation to select a color for the background and for the text in colorpicker
     * @example
     * ```javascript
     *  new Jodit('#editor', {
     *     colors: ['#ff0000', '#00ff00', '#0000ff']
     * })
     * ```
     */
    colors: {
        [key: string]: string[];
    } | string[];
    /**
     * The default tab color picker
     * @example
     * ```javascript
     *  new Jodit('#editor2', {
     *     colorPickerDefaultTab: 'color'
     * })
     * ```
     */
    colorPickerDefaultTab: 'background' | 'color';
    /**
     * Image size defaults to a larger image
     */
    imageDefaultWidth: number;
    /**
     * Do not display these buttons that are on the list
     * @example
     * ```javascript
     * new Jodit('#editor2', {
     *     removeButtons: ['hr', 'source']
     * });
     * ```
     */
    removeButtons: string[];
    /**
     * Do not init these plugins
     * @example
     * ```typescript
     * var editor = new Jodit('.editor', {
     *    disablePlugins: 'table,iframe'
     * });
     * //or
     * var editor = new Jodit('.editor', {
     *    disablePlugins: ['table', 'iframe']
     * });
     * ```
     */
    disablePlugins: string[] | string;
    /**
     * This buttons list will be added to option.buttons
     */
    extraButtons: Array<string | ControlType>;
    /**
     * The width of the editor, accepted as the biggest. Used to the responsive version of the editor
     */
    sizeLG: number;
    /**
     * The width of the editor, accepted as the medium. Used to the responsive version of the editor
     */
    sizeMD: number;
    /**
     * The width of the editor, accepted as the small. Used to the responsive version of the editor
     */
    sizeSM: number;
    /**
     * The list of buttons that appear in the editor's toolbar on large places (≥ options.sizeLG). Note - this is not the width of the device, the width of the editor
     * @example
     * ```javascript
     * new Jodit('#editor', {
     *     buttons: ['bold', 'italic', 'source'],
     *     buttonsMD: ['bold', 'italic'],
     *     buttonsXS: ['bold', 'fullsize'],
     * });
     * ```
     * @example
     * ```javascript
     * new Jodit('#editor2', {
     *     buttons: [{
     *         name: 'enty',
     *         icon: 'source',
     *         exec: function () {
     *             var dialog = new Jodit.modules.Dialog(this),
     *                 div = document.createElement('div'),
     *                 text = document.createElement('textarea');
     *             div.innerText = this.val();
     *             dialog.setTitle('Source code');
     *             dialog.setContent(text);
     *             dialog.setSize(400, 300);
     *             dom(text)
     *                 .css({
     *                     width: '100%',
     *                     height: '100%'
     *                 })
     *                 .val(div.innerHTML.replace(/<br>/g, '\n'));
     *             dialog.{@link module:Dialog~open|open}();
     *         }
     *     }]
     * });
     * ```
     * @example
     * ```javascript
     * new Jodit('#editor2', {
     *     buttons: Jodit.defaultOptions.buttons.concat([{
     *        name: 'listsss',
     *        iconURL: 'stuf/dummy.png',
     *        list: {
     *            h1: 'insert Header 1',
     *            h2: 'insert Header 2',
     *            clear: 'Empty editor',
     *        },
     *        exec: ({originalEvent, control, btn}) => {
     *             var key = control.args[0],
     *                value = control.args[1];
     *             if (key === 'clear') {
     *                 this.val('');
     *                 return;
     *             }
     *             this.selection.insertNode(Jodit.modules.Dom.create(key, ''));
     *             this.events.fire('errorMessage', 'Was inserted ' + value);
     *        },
     *        template: function (key, value) {
     *            return '<div>' + value + '</div>';
     *        }
     *  });
     *  ```
     */
    buttons: Buttons;
    /**
     * The list of buttons that appear in the editor's toolbar on medium places (≥ options.sizeMD).
     */
    buttonsMD: Buttons;
    /**
     * The list of buttons that appear in the editor's toolbar on small places (≥ options.sizeSM).
     */
    buttonsSM: Buttons;
    /**
     * The list of buttons that appear in the editor's toolbar on extra small places (< options.sizeSM).
     */
    buttonsXS: Buttons;
    /**
     * Behavior for buttons
     */
    controls: Controls;
    events: {
        [key: string]: Function;
    };
    /**
     * Buttons in toolbat without SVG - only texts
     * @type {boolean}
     */
    textIcons: boolean;
}
export declare const OptionsDefault: any;
