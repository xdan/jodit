import * as consts from './constants'
import {dom, trim, $$, normalizeColor, isURL, convertMediaURLToVideoEmbed} from './modules/Helpers'

/**
 * Default Editor's Configuration
 **/

export class Config {

    /**
     * @prop {int} zIndex=0 zindex For editor
     * @since 2.5.61
     * @link http://xdsoft.net/jodit/doc/#2.5.61
     */
    zIndex = 0;

    /**
     * @prop {int} offsetTopForAssix=0 For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to move the toolbar Jodit by this amount [more](http://xdsoft.net/jodit/doc/#2.5.57)
     * @since 2.4.57
     * @link http://xdsoft.net/jodit/doc/#2.5.57
     */

    offsetTopForAssix = 0;

    /**
     * @prop {int} syncCodeTimeout=30 timeout synchronize data between the editor , source element and source code editor
     * @since 2.4.16
     */
    syncCodeTimeout = 30;

    /**
     * @prop {string} toolbarButtonSize=middle Size of icons in the toolbar (can be "small", "middle", "large")
     * @since 2.4.12
     * @example
     * var editor  = new  Jodit(".dark_editor", {
     *      toolbarButtonSize: "small"
     * });
     */
    toolbarButtonSize = 'middle';

    /**
     * @prop {string} theme=default Theme (can be "dark")
     * @since 2.4.2
     * @example
     * var editor  = new  Jodit(".dark_editor", {
     *      theme: "dark"
     * });
     */
    theme = 'default';

    /**
     * @prop {boolean} saveModeInCookie=false if it is true that the current mode is saved in a cookie , and is restored after a reload of the page
     * @since 2.3.59
     */
    saveModeInCookie = false;

    /**
     * @prop {boolean} spellcheck=true options specifies whether the editor is to have its spelling and grammar checked or not
     * @see {@link http://www.w3schools.com/tags/att_global_spellcheck.asp}
     * @since 2.3.48
     */
    spellcheck = true;

   /**
     * @prop {string|false} editorCssClass=false Class name that can be appended to the editor
     * @see {@link Jodit.defaultOptions.iframeCSSLinks|iframeCSSLinks}
     * @see {@link Jodit.defaultOptions.iframeStyle|iframeStyle}
     * @since 2.3.31
     * @example
     * <script>
     * new Jodit('#editor', {
     *    editorCssClass: 'some_my_class'
     * });
     * </script>
     * <style>
     * .some_my_class p{
     *    line-height: 16px;
     * }
     * </style>
     */
    editorCssClass = false;

   /**
     * @prop {boolean} triggerChangeEvent=true After all changes in editors for textarea will call change trigger
     * @since 2.3.30
     * @example
     * new Jodit('#editor');
     * document.getElementById('editor').addEventListener('change', function () {
     *      console.log(this.value);
     * })
     */
    triggerChangeEvent = true;

    /**
     * @prop {boolean} iframe=false When this option is enabled, the editor's content will be placed in an iframe and isolated from the rest of the page.
     * @example
     * new Jodit('#editor', {
     *    iframe = true;
     *    iframeStyle = 'html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index: 2;user-select:auto;margin:0px;overflow:hidden;}body:after{content:"";clear:both;display:block}';
     * })
     */
    iframe = false;

    /**
     * @prop {boolean|string} iframeBaseUrl=false Base URL where the root directory for {@link Jodit.defaultOptions.iframe|iframe} mode
     * @example
     * new Jodit('#editor', {
     *    iframe: true,
     *    iframeBaseUrl: 'http://xdsoft.net/jodit/docs/',
     * })
     */
    iframeBaseUrl = false;

    /**
     * @prop {string} iframeStyle='html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index: 2;user-select:auto;margin:0px;overflow:auto;}body:after{content:"";clear:both;display:block}table{width:100%;border-collapse:collapse} th,td{border:1px solid #ccc;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}p{margin-top:0;}' Custom style to be used inside the iframe to display content.
     * @example
     * new Jodit('#editor', {
     *    iframe: true,
     *    iframeStyle: 'html{margin: 0px;}',
     * })
     */

    iframeStyle = 'html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index: 2;user-select:auto;margin:0px;overflow:auto;}body:after{content:"";clear:both;display:block}table{width:100%;border-collapse:collapse} th,td{border:1px solid #ccc;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}td.jodit_focused_cell,th.jodit_focused_cell{border: 1px double blue}p{margin-top:0;}.jodit_editor .jodit_iframe_wrapper{display: block;clear: both;user-select: none;position: relative;}.jodit_editor .jodit_iframe_wrapper:after {position:absolute;content:"";z-index:1;top:0;left:0;right: 0;bottom: 0;cursor: pointer;display: block;background: rgba(0, 0, 0, 0);}';

    /**
     * @prop {array} iframeCSSLinks='[]' Custom stylesheet files to be used inside the iframe to display content.
     * @example
     * new Jodit('#editor', {
     *    iframe: true,
     *    iframeCSSLinks: ['styles/default.css'],
     * })
     */

    iframeCSSLinks = [];

    /**
     * @prop {string} iframeIncludeJoditStyle=true Include jodit.min.css in iframe document
     * @deprecated since version 2.3.31
     */
    iframeIncludeJoditStyle = true;

    /**
     * @prop {string|int} width='auto' Editor's width
     * @example
     * new Jodit('.editor', {
     *    width: '100%',
     * })
     * @example
     * new Jodit('.editor', {
     *    width: 600, // equivalent for '600px'
     * })
     * @example
     * new Jodit('.editor', {
     *    width: 'auto', // autosize
     * })
     */

    width = 'auto';

    /**
     * @prop {string|int} height='auto' Editor's height
     * @example
     * new Jodit('.editor', {
     *    height: '100%',
     * })
     * @example
     * new Jodit('.editor', {
     *    height: 600, // equivalent for '600px'
     * })
     * @example
     * new Jodit('.editor', {
     *    height: 'auto', // autosize
     * })
     */
    height = 'auto';

    /**
     * @prop {string|int} height=100 Editor's min-height
     * @example
     * new Jodit('.editor', {
     *    minHeight: '30%' //min-height: 30%
     * })
     * @example
     * new Jodit('.editor', {
     *    minHeight: 200 //min-height: 200px
     * })
     */
    minHeight = 100;

    /**
     * @prop {string} direction='' The writing direction of the language which is used to create editor content. Allowed values are: '' (an empty string) – Indicates that content direction will be the same as either the editor UI direction or the page element direction. 'ltr' – Indicates a Left-To-Right text direction (like in English). 'rtl' – Indicates a Right-To-Left text direction (like in Arabic).
     * @example
     * new Jodit('.editor', {
     *    direction: 'rtl'
     * })
     */
    direction = '';

    /**
     * @prop {string} language=en Language by default
     * @example
     * // include in you page lang file
     * <script src="jodit/lang/de.js"></script>
     * <script>
     * vae editor = new Jodit('.editor', {
     *    language: 'de'
     * });
     * </script>
     */
    language = 'en';

    /**
     * @prop {PlainObject} i18n=Jodit.lang Collection of language pack data {en: {'Type something': 'Type something', ...}}
     * @example
     * var editor = new Jodit('#editor', {
     *     language: 'ru',
     *     i18n: {
     *         ru: {
     *            'Type something': 'Начните что-либо вводить'
     *         }
     *     }
     * });
     * console.log(editor.i18n('Type something')) //Начните что-либо вводить
     */
    i18n = 'en';

    /**
     * @prop {int} tabIndex=-1 The tabindex global attribute is an integer indicating if the element can take input focus (is focusable), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values
     */
    tabIndex = -1;

    /**
     * @prop {boolean} autofocus=false true After loading the page into the editor once the focus is set
     */
    autofocus = false;

    /**
     * @prop {boolean} toolbar=true true Show toolbar
     */
    toolbar = true;

    // TODO
    // autosave: false, // false or url
    // autosaveCallback: false, // function
    // interval: 60, // seconds
    // TODO

    /**
     * @prop {(Jodit.ENTER_P|Jodit.ENTER_DIV|Jodit.ENTER_BR)} enter=Jodit.ENTER_P Element that will be created when you press Enter
     * @see {@link module:EnterKey~enter|EnterKey.enter}
     */
    enter = consts.PARAGRAPH;

    /**
     * @prop {(Jodit.MODE_WYSIWYG|Jodit.MODE_AREA|Jodit.MODE_SPLIT)} efaultMode=Jodit.MODE_SPLIT Jodit.MODE_WYSIWYG The HTML editor allows you to write like MSWord, Jodit.MODE_AREA syntax highlighting source editor
     * @example
     * var editor = new Jodit('#editor', {
     *     defaultMode: Jodit.MODE_SPLIT
     * });
     * console.log(editor.getRealMode())
     *
     */
    defaultMode = consts.MODE_WYSIWYG;

    /**
     * @prop {boolean} useSplitMode=false Use in {@link module:Jodit~toggleMode|Jodit.toggleMode} Jodit.MODE_SPLIT mode
     */
    useSplitMode = false;

    /**
     * @prop {array} colors The colors in HEX representation to select a color for the background and for the text in colorpicker
     * @example
     *  new Jodit('#editor', {
     *     colors: ['#ff0000', '#00ff00', '#0000ff']
     * })
     */
    colors = {
        greyscale:  ['#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'],
        palette:    ['#980000', '#FF0000', '#FF9900', '#FFFF00', '#00F0F0', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'],
        full: [
            '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
            '#DD7E6B', '#EA9999', '#F9CB9C', '#FFE599', '#B6D7A8', '#A2C4C9', '#A4C2F4', '#9FC5E8', '#B4A7D6', '#D5A6BD',
            '#CC4125', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0',
            '#A61C00', '#CC0000', '#E69138', '#F1C232', '#6AA84F', '#45818E', '#3C78D8', '#3D85C6', '#674EA7', '#A64D79',
            '#85200C', '#990000', '#B45F06', '#BF9000', '#38761D', '#134F5C', '#1155CC', '#0B5394', '#351C75', '#733554',
            '#5B0F00', '#660000', '#783F04', '#7F6000', '#274E13', '#0C343D', '#1C4587', '#073763', '#20124D', '#4C1130'
        ]
    };

    /**
     * @prop {('background'|'color')} colorPickerDefaultTab='background' The default tab color picker
     * @example
     *  new Jodit('#editor2', {
     *     colorPickerDefaultTab: 'color'
     * })
     */
    colorPickerDefaultTab = 'background';

    /**
     * @property {int} imageDefaultWidth=300 Image size defaults to a larger image
     */
    imageDefaultWidth = 300;

    /**
     * @property {array} removeButtons Do not display those buttons that are on the list
     * @example
     * new Jodit('#editor2', {
     *     removeButtons: ['hr', 'source']
     * });
     */
    removeButtons = [];

    /**
     * @property {int} sizeLG=900 The width of the editor, accepted as the biggest. Used to the responsive version of the editor
     * @since 2.5.49
     */
    sizeLG = 900;

    /**
     * @property {int} sizeMD=700 The width of the editor, accepted as the medium. Used to the responsive version of the editor
     * @since 2.5.49
     */
    sizeMD = 700;

    /**
     * @property {int} sizeSM=700 The width of the editor, accepted as the small. Used to the responsive version of the editor
     * @since 2.5.49
     */
    sizeSM = 400;

    /**
     * @property {array} buttons The list of buttons that appear in the editor's toolbar on large places (≥ options.sizeLG). Note - this is not the width of the device, the width of the editor
     * @property {array} buttonsMD The list of buttons that appear in the editor's toolbar on medium places (≥ options.sizeMD).
     * @property {array} buttonsSM The list of buttons that appear in the editor's toolbar on small places (≥ options.sizeSM).
     * @property {array} buttonsXS The list of buttons that appear in the editor's toolbar on extra small places (< options.sizeSM).
     * @property {string|object} buttons.button Button. Clicking has the next priority popap, exec, list
     * @property {string} [buttons.button.icon] If there 'temp' button, then the tag is of the form <code>&lt;a class="icon icon-temp"&gt</code>. Of the existing can be used:
     * <code>addcolumn, addrow, attachment, bin, bold, brush, cancel, check, source, eraser, folder, font, fullsize, image, indent-decrease, indent-increase, italic, link, ol, ul, list2, lock, menu,  merge, hr, center, justify, left, right, pencil, paragraph, plus, redo, resize, shrink, splitg, splitv, strikethrough, table, fontsize, underline, undo, unlock, update, upload, valign</code>
     * @property {string} [buttons.button.iconURL] If you want to address , you can set a background image for the button . This icon should be 16 * 16 px
     * @property {function} [buttons.button.exec] This function will be executed when the button is pressed . this it is the main instance Jodit
     * @property {function} [buttons.button.popap] By pressing a button the window falls , the contents of which will be something that will return 'popap'
     * @property {string} [buttons.button.tooltip] Description hover button
     * @property {string} [buttons.button.command] The command to execute when the button is pressed. allowed all {@link https://developer.mozilla.org/ru/docs/Web/API/Document/execCommand#стандартные команды} а также несколько нестандартных (см. {@link module:Jodit~execCommand|execCommand})
     * @property {array} [buttons.button.tags] Tag list when the cursor is to be highlighted on this button
     * @property {array|object} [buttons.button.list] Drop-down list. A hash or array . You must specify the command which will be submitted to the hash key (array value) (see .{@link module:Jodit~execCommand|execCommand}) or define 'exec' function. See example
     * @property {function(key, value): string} [buttons.button.template] The method that will be called for each element button.list
     * @default ['source', '|', 'bold', 'italic', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'brush', 'paragraph', '|','image', 'video', 'table', 'link', '|', 'align', '|', 'undo', 'redo', '|', 'hr', 'eraser', 'fullsize']
     * @example
     * new Jodit('#editor', {
     *     buttons: ['bold', 'italic', 'source'],
     *     buttonsMD: ['bold', 'italic'],
     *     buttonsXS: ['bold', 'fullsize'],
     * });
     * @example
     * new Jodit('#editor2', {
     *     buttons: [{
     *         name: 'enty',
     *         icon: 'source',
     *         exec: function () {
     *             var dialog = new {@link module:Dialog|Jodit.modules.Dialog}(this),
     *                 div = document.createElement('div'),
     *                 text = document.createElement('textarea');
     *             div.innerText = this.val();
     *             dialog.{@link module:Dialog~setTitle|setTitle}('Source code');
     *             dialog.{@link module:Dialog~setContent|setContent}(text);
     *             dialog.{@link module:Dialog~setSize|setSize}(400, 300);
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
     * @example
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
     *             this.selection.{@link module:Selection~insertNode|insertNode}(this.enterkey.{@link module:EnterKey~createNewBlock|createNewBlock}(key));
     *             this.{@link module:Events|events}.fire('{@link event:errorMessage|errorMessage}', ['Was inserted ' + value]);
     *        },
     *        template: function (key, value) {
     *            return '<div>' + value + '</div>';
     *        }
     *  });
     */
    buttons = [
        'source', '|',
        'bold',
        'italic', '|',
        'ul',
        'ol', '|',
        'font',
        'fontsize',
        'brush',
        'paragraph', '|',
        'image',
        'video',
        'table',
        'link', '|',
        'align','|',
        'undo', 'redo', '|',
        'hr',
        'eraser',
        'fullsize',
        'about'
    ];
    buttonsMD = [
        'source', '|',
        'bold',
        'italic', '|',
        'ul',
        'ol', '|',
        'font',
        'fontsize',
        'brush',
        'paragraph', '|',
        'image',
        'table',
        'link', '|',
        'align','|',
        'undo', 'redo', '|',
        'hr',
        'eraser',
        'fullsize'
    ];
    buttonsSM = [
        'source', '|',
        'bold',
        'italic', '|',
        'ul',
        'ol', '|',
        'fontsize',
        'brush',
        'paragraph', '|',
        'image',
        'table',
        'link', '|',
        'align','|',
        'undo', 'redo', '|',
        'eraser',
        'fullsize'
    ];
    buttonsXS = [
        'bold',
        'image', '|',
        'brush',
        'paragraph', '|',
        'align', '|',
        'undo', 'redo', '|',
        'eraser'
    ];

    /**
     * Behavior for buttons
     * @type {Object}
     */
    controls = {
        about: {
            exec: ({editor}) => {
                let dialog = new (require('./modules/Dialog').default)(editor);
                dialog.setTitle(editor.i18n('About Jodit'));
                dialog.setContent(
                    '<div class="jodit_about">\
                        <div>' + editor.i18n('Jodit Editor') + ' v.' + editor.getVersion() + ' ' + editor.i18n('Free Non-commercial Version') + '</div>\
                        <div><a href="http://xdsoft.net/jodit/" target="_blank">http://xdsoft.net/jodit/</a></div>\
                        <div><a href="http://xdsoft.net/jodit/doc/" target="_blank">' + editor.i18n('Jodit User\'s Guide') + '</a> ' + editor.i18n('contains detailed help for using') + '</div>\
                        <div>' + editor.i18n('For information about the license, please go to our website:') + '</div>\
                        <div><a href="http://xdsoft.net/jodit/license.html" target="_blank">http://xdsoft.net/jodit/license.html</a></div>\
                        <div><a href="http://xdsoft.net/jodit/#download" target="_blank">' + editor.i18n('Buy full version') + '</a></div>\
                        <div>' + editor.i18n('Copyright © XDSoft.net - Chupurnov Valeriy. All rights reserved.') + '</div>\
                    </div>'
                );
                dialog.open();
            },
            tooltip: 'About Jodit',
            mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
        },
        fullsize: {
            exec: ({editor}) => {
                editor.events.fire('toggleFullsize');
            },
            tooltip: 'Open editor in fullsize',
            mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
        },
        eraser: {
            command: 'removeFormat',
            tooltip: 'Clear Formatting'
        },
        brush: {
            css: {
                'backgroundColor' : ({editor, color}) => {
                    let  check = (colors) => {
                            let i, keys;
                            if (typeof colors === 'object') {
                                keys = Object.keys(colors);
                                for (i = 0; i < keys.length; i += 1) {
                                    if (check(colors[keys[i]])) {
                                        return true;
                                    }
                                }
                            } else if (Array.isArray(colors)) {
                                return colors.indexOf(normalizeColor(color)) !== -1;
                            }
                            return false;
                        };

                    return check(editor.options.colors);
                }
            },
            popap: ({editor}) => {
                let sel = editor.win.getSelection(), color = '', bg_color = '', current, tabs,
                    checkRemoveOpportunity = () => {
                        if (current && (!current.hasAttribute("style") || !current.getAttribute("style").length)) {
                            let selInfo = editor.selection.save();
                            while (current.firstChild) {
                                current.parentNode.insertBefore(current.firstChild, current);
                            }
                            current.parentNode.removeChild(current)
                            current = null;
                            editor.selection.restore(selInfo);
                        }
                    },
                    tryGetCurrent = () => {
                        if (sel && sel.anchorNode) {
                            [sel.anchorNode, sel.anchorNode.parentNode].forEach((elm) => {
                                if (elm && elm.hasAttribute && elm.hasAttribute("style") && elm.getAttribute('style').indexOf('background') !== -1 && elm.style.backgroundColor) {
                                    current = elm;
                                    bg_color = editor.win.getComputedStyle(current).getPropertyValue('background-color');
                                }

                                if (elm && elm.hasAttribute && elm.hasAttribute('style') && elm.getAttribute('style').indexOf('color') !== -1 && elm.style.color) {
                                    current = elm;
                                    color = current.style.color;
                                }
                            })
                        }
                    };

                tryGetCurrent();

                let widget = new (require('./modules/Widget').default)(editor);

                const backgroundTag = widget.create('ColorPicker', (value) => {
                    if (!current) {
                        editor.execCommand('background', false, value);
                        tryGetCurrent();
                    } else {
                        current.style.backgroundColor = value;
                    }
                    checkRemoveOpportunity();
                }, bg_color);

                const colorTab = widget.create('ColorPicker', (value) => {
                    if (!current) {
                        editor.execCommand('forecolor', false, value);
                        tryGetCurrent();
                    } else {
                        current.style.color = value;
                    }
                    checkRemoveOpportunity();
                }, color);

                if (editor.options.colorPickerDefaultTab === 'background') {
                    tabs = {
                        Background : backgroundTag,
                        Text : colorTab
                    };
                } else {
                    tabs = {
                        Text : colorTab,
                        Background : backgroundTag
                    };
                }

                return widget.create('Tabs', tabs);
            },
            tooltip: "Fill color or set the text color"
        },
        redo: {
            mode: consts.MODE_SPLIT,
            tooltip: 'Redo'
        },
        undo: {
            mode: consts.MODE_SPLIT,
            tooltip: 'Undo'
        },

        bold: {
            tagRegExp: /^(strong|b)$/i,
            tags: ["strong", "b"],
            css: {
                "font-weight": ["bold", "700"]
            },
            tooltip: "Bold",
        },
        italic: {
            tagRegExp: /^(em|i)$/i,
            tags: ["em", "i"],
            css: {
                "font-style": "italic"
            },
            tooltip: "Italic",
        },
        underline: {
            tagRegExp: /^(u)$/i,
            tags: ['u'],
            css: {
                "text-decoration": "underline"
            },
            tooltip: "Underline",
        },
        strikethrough: {
            tagRegExp: /^(s)$/i,
            tags: ['s'],
            css: {
                "text-decoration": "line-through"
            },
            tooltip: "Strike through",
        },

        ul: {
            command: 'insertUnorderedList',
            controlName : 'ul',
            tags: ["ul"],
            tooltip: "Insert Unordered List"
        },
        ol: {
            command: 'insertOrderedList',
            controlName : 'ol',
            tags: ["ol"],
            tooltip: "Insert Ordered List"
        },
        align: {
            tags: ["p", "div", "span", "td", "th", "img"],
            name: 'left',
            tooltip: "Align",
            list: [
                'center',
                'left',
                'right',
                'justify',
            ],
        },
        center: {
            command: 'justifyCenter',
            tags: ["center"],
            css: {
                "text-align": "center"
            },
            tooltip: "Align Center"
        },
        justify: {
            command: 'justifyFull',
            css: {
                "text-align": "justify"
            },
            tooltip: "Align Justify"
        },
        left: {
            command: 'justifyLeft',
            css: {
                "text-align": "left"
            },
            tooltip: "Align Left"
        },
        right: {
            command: 'justifyRight',
            css: {
                "text-align": "right"
            },
            tooltip: "Align Right"
        },
        hr : {
            command: 'insertHorizontalRule',
            tags: ["hr"],
            tooltip: "Insert Horizontal Line"
        },
        image : {
            popap: ({editor, current, close}) => {
                const insertImage = (url) => {
                    editor.selection.insertNode(dom('<img src="' + url + '"/>', editor.doc));
                }

                let widget = new (require('./modules/Widget').default)(editor);

                let sourceImage;

                if (current && current.nodeType !== Node.TEXT_NODE && (current.tagName === 'IMG' || $$('img', current).length)) {
                    sourceImage = current.tagName === 'IMG' ? current : $$('img', current)[0];
                }

                return widget.create('ImageSelector', {
                    filebrowser: (data) => {
                        if (data.files && data.files.length) {
                            let i;
                            for (i = 0; i < data.files.length; i += 1) {
                                insertImage(data.baseurl + data.files[i]);
                            }
                        }
                        close();
                    },
                    upload: (data) => {
                        let i;
                        if (data.files && data.files.length) {
                            for (i = 0; i < data.files.length; i += 1) {
                                insertImage(data.baseurl + data.files[i]);
                            }
                        }
                        close();
                    },
                    url: function (url, text) {
                        let image = sourceImage || dom('<img/>', editor.doc);

                        image.setAttribute('src', url);
                        image.setAttribute('alt', text);

                        if (!sourceImage) {
                            editor.selection.insertNode(image);
                        }
                        close();
                    }
                }, sourceImage);
            },
            tags: ["img"],
            tooltip: "Insert Image"
        },
        link : {
            popap: ({editor, current, close}) => {
                let sel = editor.win.getSelection(),
                    form = dom('<form class="jodit_form">' +
                        '<input required name="url" placeholder="http://" type="text"/>' +
                        '<input name="text" placeholder="' + editor.i18n('Text') + '" type="text"/>' +
                        '<label><input name="target" type="checkbox"/> ' + editor.i18n('Open in new tab') + '</label>' +
                        '<label><input name="nofollow" type="checkbox"/> ' + editor.i18n('No follow') + '</label>' +
                        '<div style="text-align: right">' +
                            '<button class="jodit_unlink_button" type="button">' + editor.i18n('Unlink') + '</button> &nbsp;&nbsp;' +
                            '<button type="submit">' + editor.i18n('Insert') + '</button>' +
                        '</div>' +
                    '<form/>');

                if (current && editor.node.closest(current, 'A')) {
                    current = editor.node.closest(current, 'A')
                } else {
                    current = false;
                }

                if (current) {
                    form.querySelector('input[name=url]').value = current.getAttribute('href');
                    form.querySelector('input[name=text]').value = current.innerText;
                    form.querySelector('input[name=target]').checked = (current.getAttribute('target') === '_blank');
                    form.querySelector('input[name=nofollow]').checked = (current.getAttribute('rel') === 'nofollow');
                } else {
                    form.querySelector('.jodit_unlink_button').style.display = 'none';
                    form.querySelector('input[name=text]').value = sel.toString();
                }

                let selInfo = editor.selection.save();

                form.querySelector('.jodit_unlink_button').addEventListener('mousedown', (event: Event) => {
                    if (current) {
                        editor.node.unwrap(current);
                    }
                    close();
                });

                form.addEventListener('submit', (event: Event) => {
                    event.preventDefault()
                    editor.selection.restore(selInfo);

                    let a = current || editor.node.create('a');

                    if (!form.querySelector('input[name=url]').value) {
                        form.querySelector('input[name=url]').focus();
                        form.querySelector('input[name=url]').classList.add('jodit_error');
                        return false;
                    }


                    a.setAttribute('href', form.querySelector('input[name=url]').value);
                    a.innerText = form.querySelector('input[name=text]').value;

                    if (form.querySelector('input[name=target]').checked) {
                        a.setAttribute('target', '_blank');
                    } else {
                        a.removeAttribute('target');
                    }

                    if (form.querySelector('input[name=nofollow]').checked) {
                        a.setAttribute('rel', 'nofollow');
                    } else {
                        a.removeAttribute('rel');
                    }

                    if (!current) {
                        editor.selection.insertNode(a);
                    }

                    close();
                    return false;
                });

                return form;
            },
            tags: ["a"],
            tooltip: "Insert link"
        },

        video : {
            popap: ({editor}) => {
                let bylink = dom('<form class="jodit_form">' +
                        '<input required name="code" placeholder="http://" type="url"/>' +
                        '<button type="submit">' + editor.i18n('Insert') + '</button>' +
                        '</form>'),

                    bycode = dom('<form class="jodit_form">' +
                        '<textarea required name="code" placeholder="' + editor.i18n('Embed code') + '"></textarea>' +
                        '<button type="submit">' + editor.i18n('Insert') + '</button>' +
                        '</form>'),

                    tab = {},
                    selinfo = editor.selection.save(),
                    insertCode = (code) => {
                        editor.selection.restore(selinfo);
                        editor.selection.insertHTML(code);
                    };

                tab[(require('./modules/Toolbar').default).getIcon('link') + '&nbsp;' + editor.i18n('Link')] = bylink;
                tab[(require('./modules/Toolbar').default).getIcon('source') + '&nbsp;' + editor.i18n('Code')] = bycode;

                bycode.addEventListener('submit', (event) => {
                    event.preventDefault();

                    if (!trim(bycode.querySelector('textarea[name=code]').value)) {
                        bycode.querySelector('textarea[name=code]').focus();
                        bycode.querySelector('textarea[name=code]').classList.add('jodit_error');
                        return false;
                    }

                    insertCode(bycode.querySelector('textarea[name=code]').value);
                    return false;
                });

                bylink.addEventListener('submit',  (event) => {
                    event.preventDefault();
                    if (!isURL(bylink.querySelector('input[name=code]').value)) {
                        bylink.querySelector('input[name=code]').focus();
                        bylink.querySelector('input[name=code]').classList.add('jodit_error');
                        return false;
                    }
                    insertCode(convertMediaURLToVideoEmbed(bylink.querySelector('input[name=code]').value));
                    return false;
                });


                let widget = new (require('./modules/Widget').default)(editor);
                return widget.create('Tabs', tab);
            },
            tags: ["iframe"],
            tooltip: "Insert youtube/vimeo video"
        },

        fontsize : {
            command: 'fontSize',
            list : ["8", "9", "10", "11", "12", "14", "18", "24", "30", "36", "48", "60", "72", "96"],
            template : ({value}) => value,
            tooltip: "Font size"
        },
        font : {
            command: 'fontname',
            exec: ({editor, control}) => {
                editor.execCommand(control.command, false, control.args[0]);
            },
            list :  {
                "Helvetica,sans-serif": "Helvetica",
                "Arial,Helvetica,sans-serif": "Arial",
                "Georgia,serif": "Georgia",
                "Impact,Charcoal,sans-serif": "Impact",
                "Tahoma,Geneva,sans-serif": "Tahoma",
                "'Times New Roman',Times,serif": "Times New Roman",
                "Verdana,Geneva,sans-serif": "Verdana"
            },
            template : ({key, value}) => {
                return '<span style="font-family: ' + key + '"> ' + value + ' </span>';
            },
            tooltip: "Font family"
        },
        paragraph : {
            command: 'formatBlock',
            exec: ({editor, control}) => {
                editor.execCommand(control.command, false, control.args[0]);
            },
            list: {
                p : "Normal",
                h1 : "Heading 1",
                h2 : "Heading 2",
                h3 : "Heading 3",
                h4 : "Heading 4",
                blockquote : "Quote",
                pre : "Code"
            },
            template : ({key, value, editor}) => {
                return '<' + key + ' class="jodit_list_element"><span>' + editor.i18n(value) + '</span></' + key + '></li>';
            },
            tooltip: "Insert format block"
        },
        table : {
            cols: 10,
            popap: ({editor, control, close}) => {
                let i,
                    j,
                    k,
                    div,
                    form = dom('<form class="jodit_form jodit_form_inserter">' +
                        '<label>' +
                            '<span>1</span> &times; <span>1</span>' +
                        '</label>' +
                        '</form>'),
                    rows_count = 1,
                    cols_count = 1,
                    default_cols_count = control.cols,
                    rows = form.querySelectorAll('span')[0],
                    cols = form.querySelectorAll('span')[1],
                    cells = [];

                let generateRows = (need_rows) => {
                    let cnt = (need_rows + 1) * default_cols_count;
                    if (cells.length > cnt) {
                        for (i = cnt; i < cells.length; i += 1) {
                            form.removeChild(cells[i]);
                            delete cells[i];
                        }
                        cells.length = cnt;
                    }
                    for (i = 0; i < cnt; i += 1) {
                        if (!cells[i]) {
                            div = document.createElement('div');
                            div.index = i;
                            cells.push(div);
                        }
                    }
                    cells.forEach((cell) => {
                        form.appendChild(cell);
                    })

                    form.style.width = (cells[0].offsetWidth * default_cols_count) + 'px';
                }

                generateRows(1);

                cells[0].className = 'hovered';

                let mouseenter = (e, index) => {
                    if (e.target.tagName !== 'DIV') {
                        return;
                    }
                    let div = e.target;
                    k = isNaN(index) ? div.index : index;
                    rows_count = Math.ceil((k + 1) / default_cols_count);
                    cols_count = k % default_cols_count + 1;
                    generateRows(rows_count);

                    if (cols_count === default_cols_count || (cols_count < default_cols_count - 1 && default_cols_count > 10)) {
                        default_cols_count = cols_count === default_cols_count ? default_cols_count + 1 : default_cols_count - 1;
                        return mouseenter(e, cols_count + (rows_count - 1)  * default_cols_count - 1);
                    }

                    for (i = 0; i < cells.length; i += 1) {
                        if (cols_count >= i % default_cols_count + 1 &&  rows_count >= Math.ceil((i + 1) / default_cols_count)) {
                            cells[i].className = 'hovered';
                        } else {
                            cells[i].className = '';
                        }
                    }

                    cols.innerText = (cols_count);
                    rows.innerText = (rows_count);
                }

                form.addEventListener('mousemove', mouseenter);

                form.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (e.target.tagName !== 'DIV') {
                        return;
                    }
                    k =  e.target.index;
                    rows_count = Math.ceil((k + 1) / default_cols_count);
                    cols_count = k % default_cols_count + 1;

                    let table = editor.doc.createElement('table'), first_td, tr, td, br, w = (100 / cols_count).toFixed(7);
                    for (i = 1; i <= rows_count; i += 1) {
                        tr = editor.doc.createElement('tr');
                        for (j = 1; j <= cols_count; j += 1) {
                            td = editor.doc.createElement('td');

                            td.style.width = w + '%';
                            if (!first_td) {
                                first_td = td;
                            }
                            br = editor.doc.createElement('br');
                            td.appendChild(br);
                            tr.appendChild(editor.doc.createTextNode("\n"));
                            tr.appendChild(editor.doc.createTextNode("\t"));
                            tr.appendChild(td);
                        }
                        table.appendChild(editor.doc.createTextNode("\n"));
                        table.appendChild(tr);
                    }

                    editor.selection.insertNode(editor.doc.createTextNode("\n"));
                    editor.selection.insertNode(table);
                    editor.selection.setCursorIn(first_td);

                    close();
                });

                return form;
            },
            tags: ['table'],
            tooltip: "Insert table"
        },
        source : {
            mode: consts.MODE_SPLIT,
            exec: ({editor}) => {
                editor.toggleMode();
            },
            tooltip: "Change mode"
        }
    };

    events = {};
    textIcons = true;
}