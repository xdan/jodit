/*eslint no-unused-vars: 0*/
import * as consts from './constants'
import Dialog from './modules/Dialog'
import Jodit from './jodit'
import {Dom as $} from './modules/Dom'
/**
 * Default Editor's Configuration
 *
 * @namespace
 */
export default Jodit.defaultOptions = {
    /**
     * @prop {int} zIndex=0 zindex For editor
     * @since 2.5.61
     * @link http://xdsoft.net/jodit/doc/#2.5.61
     */
    zIndex: 0,

    /**
     * @prop {int} offsetTopForAssix=0 For example, in Joomla, the top menu bar closes Jodit toolbar when scrolling. Therefore, it is necessary to move the toolbar Jodit by this amount [more](http://xdsoft.net/jodit/doc/#2.5.57)
     * @since 2.4.57
     * @link http://xdsoft.net/jodit/doc/#2.5.57
     */

    offsetTopForAssix: 0,

    /**
     * @prop {int} syncCodeTimeout=30 timeout synchronize data between the editor , source element and source code editor
     * @since 2.4.16
     */
    syncCodeTimeout: 30,

    /**
     * @prop {string} toolbarButtonSize=middle Size of icons in the toolbar (can be "small", "middle", "large")
     * @since 2.4.12
     * @example
     * var editor  = new  Jodit(".dark_editor", {
     *      toolbarButtonSize: "small"
     * });
     */
    toolbarButtonSize: 'middle',

    /**
     * @prop {string} theme=default Theme (can be "dark")
     * @since 2.4.2
     * @example
     * var editor  = new  Jodit(".dark_editor", {
     *      theme: "dark"
     * });
     */
    theme: 'default',

    /**
     * @prop {boolean} saveModeInCookie=false if it is true that the current mode is saved in a cookie , and is restored after a reload of the page
     * @since 2.3.59
     */
    saveModeInCookie: false,

    /**
     * @prop {boolean} spellcheck=true options specifies whether the editor is to have its spelling and grammar checked or not
     * @see {@link http://www.w3schools.com/tags/att_global_spellcheck.asp}
     * @since 2.3.48
     */
    spellcheck: true,

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
    editorCssClass: false,

    /**
     * @prop {boolean} removeEmptyBlocks=true Remove empty blocks
     * @since 2.3.47
     * @example
     * var editor = new Jodit('#editor', {
     *    removeEmptyBlocks: false
     * });
     * editor.val(' ');// add space in editor
     * console.log(editor.val()); //<p>&nbsp;</p>
     *
     * editor.options.removeEmptyBlocks = true;
     * editor.val(' ');
     * console.log(editor.val()); //''
     */

    removeEmptyBlocks: true,

   /**
     * @prop {boolean} triggerChangeEvent=true After all changes in editors for textarea will call change trigger
     * @since 2.3.30
     * @example
     * new Jodit('#editor');
     * document.getElementById('editor').addEventListener('change', function () {
     *      console.log(this.value);
     * })
     */
    triggerChangeEvent: true,

    /**
     * @prop {boolean} iframe=false When this option is enabled, the editor's content will be placed in an iframe and isolated from the rest of the page.
     * @example
     * new Jodit('#editor', {
     *    iframe: true,
     *    iframeStyle: 'html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index: 2;user-select:auto;margin:0px;overflow:hidden;}body:after{content:"";clear:both;display:block}',
     * })
     */
    iframe: false,

    /**
     * @prop {boolean|string} iframeBaseUrl=false Base URL where the root directory for {@link Jodit.defaultOptions.iframe|iframe} mode
     * @example
     * new Jodit('#editor', {
     *    iframe: true,
     *    iframeBaseUrl: 'http://xdsoft.net/jodit/docs/',
     * })
     */
    iframeBaseUrl: false,

    /**
     * @prop {string} iframeStyle='html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index: 2;user-select:auto;margin:0px;overflow:auto;}body:after{content:"";clear:both;display:block}table{width:100%;border-collapse:collapse} th,td{border:1px solid #ccc;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}p{margin-top:0;}' Custom style to be used inside the iframe to display content.
     * @example
     * new Jodit('#editor', {
     *    iframe: true,
     *    iframeStyle: 'html{margin: 0px;}',
     * })
     */

    iframeStyle: 'html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index: 2;user-select:auto;margin:0px;overflow:auto;}body:after{content:"";clear:both;display:block}table{width:100%;border-collapse:collapse} th,td{border:1px solid #ccc;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}td.jodit_focused_cell,th.jodit_focused_cell{border: 1px double blue}p{margin-top:0;}.jodit_editor .jodit_iframe_wrapper{display: block;clear: both;user-select: none;position: relative;}.jodit_editor .jodit_iframe_wrapper:after {position:absolute;content:"";z-index:1;top:0;left:0;right: 0;bottom: 0;cursor: pointer;display: block;background: rgba(0, 0, 0, 0);}',

    /**
     * @prop {array} iframeCSSLinks='[]' Custom stylesheet files to be used inside the iframe to display content.
     * @example
     * new Jodit('#editor', {
     *    iframe: true,
     *    iframeCSSLinks: ['styles/default.css'],
     * })
     */

    iframeCSSLinks: [],

    /**
     * @prop {string} iframeIncludeJoditStyle=true Include jodit.min.css in iframe document
     * @deprecated since version 2.3.31
     */
    iframeIncludeJoditStyle: true,

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

    width: 'auto',

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
    height: 'auto',

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
    minHeight: 100,

    /**
     * @prop {string} direction='' The writing direction of the language which is used to create editor content. Allowed values are: '' (an empty string) – Indicates that content direction will be the same as either the editor UI direction or the page element direction. 'ltr' – Indicates a Left-To-Right text direction (like in English). 'rtl' – Indicates a Right-To-Left text direction (like in Arabic).
     * @example
     * new Jodit('.editor', {
     *    direction: 'rtl'
     * })
     */
    direction: '',

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
    language: 'en',

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
    i18n: Jodit.lang,

    /**
     * @prop {int} tabIndex=-1 The tabindex global attribute is an integer indicating if the element can take input focus (is focusable), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values
     */
    tabIndex: -1,

    /**
     * @prop {boolean} autofocus=false true After loading the page into the editor once the focus is set
     */
    autofocus: false,

    /**
     * @prop {boolean} toolbar=true true Show toolbar
     */
    toolbar: true,

    // TODO
    autosave: false, // false or url
    autosaveCallback: false, // function
    interval: 60, // seconds
    // TODO

    /**
     * @prop {(Jodit.ENTER_P|Jodit.ENTER_DIV|Jodit.ENTER_BR)} enter=Jodit.ENTER_P Element that will be created when you press Enter
     * @see {@link module:EnterKey~enter|EnterKey.enter}
     */
    enter: consts.PARAGRAPH,

    /**
     * @prop {(Jodit.MODE_WYSIWYG|Jodit.MODE_AREA|Jodit.MODE_SPLIT)} efaultMode=Jodit.MODE_SPLIT Jodit.MODE_WYSIWYG The HTML editor allows you to write like MSWord, Jodit.MODE_AREA syntax highlighting source editor
     * @example
     * var editor = new Jodit('#editor', {
     *     defaultMode: Jodit.MODE_SPLIT
     * });
     * console.log(editor.getRealMode())
     *
     */
    defaultMode: consts.MODE_WYSIWYG,

    /**
     * @prop {boolean} useSplitMode=false Use in {@link module:Jodit~toggleMode|Jodit.toggleMode} Jodit.MODE_SPLIT mode
     */
    useSplitMode: false,

    /**
     * @prop {array} colors The colors in HEX representation to select a color for the background and for the text in colorpicker
     * @example
     *  new Jodit('#editor', {
     *     colors: ['#ff0000', '#00ff00', '#0000ff']
     * })
     */
    colors: {
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
    },

    /**
     * @prop {('background'|'color')} colorPickerDefaultTab='background' The default tab color picker
     * @example
     *  new Jodit('#editor2', {
     *     colorPickerDefaultTab: 'color'
     * })
     */
    colorPickerDefaultTab: 'background',

    /**
     * @property {int} imageDefaultWidth=300 Image size defaults to a larger image
     */
    imageDefaultWidth: 300,

    /**
     * @property {array} removeButtons Do not display those buttons that are on the list
     * @example
     * new Jodit('#editor2', {
     *     removeButtons: ['hr', 'source']
     * });
     */
    removeButtons: [],

    /**
     * @property {int} sizeLG=900 The width of the editor, accepted as the biggest. Used to the responsive version of the editor
     * @since 2.5.49
     */
    sizeLG: 900,

    /**
     * @property {int} sizeMD=700 The width of the editor, accepted as the medium. Used to the responsive version of the editor
     * @since 2.5.49
     */
    sizeMD: 700,

    /**
     * @property {int} sizeSM=700 The width of the editor, accepted as the small. Used to the responsive version of the editor
     * @since 2.5.49
     */
    sizeSM: 400,

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
     * @default ['source', '|', 'bold', 'italic', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'brush', 'paragraph', '|','image', 'video', 'table', 'link', '|', 'left', 'center', 'right', 'justify', '|', 'undo', 'redo', '|', 'hr', 'eraser', 'fullsize']
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
     *             $(text)
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
     *        exec: function (e, control, $btn) {
     *             var key = control.args[0],
     *                value = control.args[1];
     *             if (key === 'clear') {
     *                 this.val('');
     *                 return;
     *             }
     *             this.selection.{@link module:Selection~insertNode|insertNode}(this.enterkey.{@link module:EnterKey~createNewBlock|createNewBlock}(key));
     *             this.{@link module:Events|events}.fire('{@link event:errorPopap|errorPopap}', ['Was inserted ' + value]);
     *        },
     *        template: function (key, value) {
     *            return '<div>' + value + '</div>';
     *        }
     *  });
     */
    buttons: [
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
        'left',
        'center',
        'right',
        'justify', '|',
        'undo', 'redo', '|',
        'hr',
        'eraser',
        'fullsize',
        'about'
    ],
    buttonsMD: [
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
        'left',
        'center',
        'right',
        'justify', '|',
        'undo', 'redo', '|',
        'hr',
        'eraser',
        'fullsize'
    ],
    buttonsSM: [
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
        'left',
        'center',
        'right', '|',
        'undo', 'redo', '|',
        'eraser',
        'fullsize'
    ],
    buttonsXS: [
        'bold',
        'image', '|',
        'brush',
        'paragraph', '|',
        'left',
        'center',
        'right', '|',
        'undo', 'redo', '|',
        'eraser'
    ],
    /**
     * Behavior for buttons
     * @type {Object}
     */
    controls: {
        about: {
            exec: function () {
                var dialog = new Dialog(this);
                dialog.setTitle(this.i18n('About Jodit'));
                dialog.setContent(
                    '<div class="jodit_about">\
                        <div>' + this.i18n('Jodit Editor') + ' v.' + this.getVersion() + ' ' + this.i18n('Free Non-commercial Version') + '</div>\
                        <div><a href="http://xdsoft.net/jodit/" target="_blank">http://xdsoft.net/jodit/</a></div>\
                        <div><a href="http://xdsoft.net/jodit/doc/" target="_blank">' + this.i18n('Jodit User\'s Guide') + '</a> ' + this.i18n('contains detailed help for using') + '</div>\
                        <div>' + this.i18n('For information about the license, please go to our website:') + '</div>\
                        <div><a href="http://xdsoft.net/jodit/license.html" target="_blank">http://xdsoft.net/jodit/license.html</a></div>\
                        <div><a href="http://xdsoft.net/jodit/#download" target="_blank">' + this.i18n('Buy full version') + '</a></div>\
                        <div>' + this.i18n('Copyright © XDSoft.net - Chupurnov Valeriy. All rights reserved.') + '</div>\
                    </div>'
                );
                dialog.open();
            },
            tooltip: 'About Jodit',
            mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
        },
        fullsize: {
            exec: function () {
                this.events.fire('toggleFullsize');
            },
            tooltip: 'Open editor in fullsize',
            mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
        },
        eraser: {
            exec: function () {
                this.exec("removeFormat", false, false);
            },
            tooltip: 'Clear Formatting'
        },
        brush: {
            css: {
                'backgroundColor' : function (color) {
                    var parent = this,
                        check = function (colors) {
                            var i, keys;
                            if ($.isPlainObject(colors)) {
                                keys = Object.keys(colors);
                                for (i = 0; i < keys.length; i += 1) {
                                    if (check(colors[keys[i]])) {
                                        return true;
                                    }
                                }
                            } else if ($.isArray(colors)) {
                                return colors.indexOf(parent.helper.normalizeColor(color)) !== -1;
                            }
                            return false;
                        };

                    return check(parent.options.colors);
                }
            },
            popap: function () {
                var sel = this.selection.get(), color = '', bg_color = '', current, $bg, $cl, tabs;
                if (sel && sel.anchorNode && $(sel.anchorNode.parentNode).attr("style") && $(sel.anchorNode.parentNode).attr("style").indexOf('background') !== -1 && $(sel.anchorNode.parentNode).css('background-color')) {
                    current = sel.anchorNode.parentNode;
                    bg_color = $(current).css('background-color');
                }
                if (sel && sel.anchorNode && $(sel.anchorNode.parentNode).attr("style") && $(sel.anchorNode.parentNode).attr("style").indexOf('color') !== -1 && $(sel.anchorNode.parentNode).css('color')) {
                    current = sel.anchorNode.parentNode;
                    color = $(current).css('color');
                }

                $bg = this.form.buildColorPicker($.proxy(function (value) {
                    if (!current) {
                        this.applyCSSProperty('background-color', value);
                    } else {
                        $(current).css('background-color', value);
                    }
                    this.closeToolbarPopap();
                }, this), bg_color);
                $cl = this.form.buildColorPicker($.proxy(function (value) {
                    if (!current) {
                        this.applyCSSProperty('color', value);
                    } else {
                        $(current).css('color', value);
                    }
                    this.closeToolbarPopap();
                }, this), color);

                if (this.options.colorPickerDefaultTab === 'background') {
                    tabs = {
                        Background : $bg,
                        Text : $cl
                    };
                } else {
                    tabs = {
                        Text : $cl,
                        Background : $bg
                    };
                }

                return this.form.buildTabs(tabs);
            },
            tooltip: "Fill color or set the text color"
        },
        redo: {
            mode: consts.MODE_SPLIT,
            exec: function () {
                if (this.getRealMode() !== consts.MODE_SOURCE) {
                    this.observer.redo();
                } else {
                    this.observerarea.redo();
                }
            },
            tooltip: 'Redo'
        },
        undo: {
            mode: consts.MODE_SPLIT,
            exec: function () {
                if (this.getRealMode() !== consts.MODE_SOURCE) {
                    this.observer.undo();
                } else {
                    this.observerarea.undo();
                }
            },
            tooltip: 'Undo'
        },
        bold: {
            tags: ["b", "strong"],
            css: {
                fontWeight: "bold"
            },
            tooltip: "Bold",
            hotkey: {"ctrl": 1, "key": 66}
        },
        italic: {
            tags: ["i", "em"],
            css: {
                fontStyle: "italic"
            },
            tooltip: "Italic",
            hotkey: {"ctrl": 1, "key": 73}
        },
        ul: {
            command: 'insertUnorderedList',
            controlName : 'ul',
            exec: function (e, control) {
                var sel = this.selection,
                    node = sel.current(),
                    newNode,
                    parentNode;

                if (this.node.hasParent(node, 'p')) {
                    parentNode = this.node.parentNode(node, 'p');
                    if (0 === this.helper.trim(parentNode.innerText).length) {
                        newNode = $('<' + control.controlName + '>\n' +
                            '<li>' + consts.INVISIBLE_SPACE + '</li>\n' +
                            '</' + control.controlName + '>\n').get(0);
                    } else {
                        newNode = $('<' + control.controlName + '>\n' +
                            '<li> ' + parentNode.innerHTML + ' </li>\n' +
                            '</' + control.controlName + '>\n').get(0);
                    }

                    this.node.replace(parentNode, newNode, true, true);
                    sel.moveCursorTo($(newNode).find('li').get(0));
                } else {
                    this.execCommand(control.command);
                }
            },
            tags: ["ul"],
            tooltip: "Insert Unordered List"
        },
        ol: {
            command: 'insertOrderedList',
            controlName : 'ol',
            exec: function (e, control) {
                this.options.controls.ul.exec.call(this, e, control);
            },
            tags: ["ol"],
            tooltip: "Insert Ordered List"
        },
        center: {
            command: 'justifyCenter',
            tags: ["center"],
            css: {
                textAlign: "center"
            },
            tooltip: "Justify Center"
        },
        justify: {
            command: 'justifyFull',
            css: {
                textAlign: "justify"
            },
            tooltip: "Justify Full"
        },
        left: {
            command: 'justifyLeft',
            css: {
                textAlign: "left"
            },
            tooltip: "Justify Left"
        },
        right: {
            command: 'justifyRight',
            css: {
                textAlign: "right"
            },
            tooltip: "Justify Right"
        },
        hr : {
            command: 'insertHorizontalRule',
            tags: ["hr"],
            tooltip: "Insert Horizontal Line"
        },
        image : {
            popap: function (elm) {
                var parent = this;
                return parent.form.imageSelector({
                    filebrowser: function (data) {
                        if (data.files && data.files.length) {
                            var i;
                            for (i = 0; i < data.files.length; i += 1) {
                                parent.selection.insertImage(data.baseurl + data.files[i]);
                            }
                            parent.closeToolbarPopap();
                            parent.syncCode();
                        }
                    },
                    upload: function (data) {
                        var i;
                        if (data.files && data.files.length) {
                            for (i = 0; i < data.files.length; i += 1) {
                                parent.selection.insertImage(data.baseurl + data.files[i]);
                            }
                        }
                        parent.closeToolbarPopap();
                        parent.syncCode();
                    },
                    url: function (url, text) {
                        var image = $(parent.form.getCurrentImage() || $('<img/>', parent.getDocument()).get(0));

                        image.attr('src', url);
                        image.attr('alt', text);

                        if (!parent.form.getCurrentImage()) {
                            parent.selection.insertImage(image.get(0));
                        }
                        parent.closeToolbarPopap();
                        parent.syncCode();
                    }
                }, elm);
            },
            tags: ["img"],
            tooltip: "Insert Image"
        },
        link : {
            popap: function () {
                var current,
                    sel = this.selection.get(),
                    $form = $('<div>' +
                        '<input required name="url" placeholder="http://" type="text"/>' +
                        '<input name="text" placeholder="' + this.i18n('Anchor') + '" type="text"/>' +
                        '<label><input name="target" type="checkbox"/> ' + this.i18n('Open in new tab') + '</label>' +
                        '<label><input name="nofollow" type="checkbox"/> ' + this.i18n('No follow') + '</label>' +
                        '<button type="button">' + this.i18n('Insert') + '</button>' +
                        '</div>');

                if (sel && sel.anchorNode && sel.anchorNode.parentNode.tagName === 'A') {
                    $form.find('input[name=url]').val(sel.anchorNode.parentNode.href);
                    $form.find('input[name=text]').val(sel.anchorNode.parentNode.text);
                    $form.find('input[name=target]').get(0).checked = (sel.anchorNode.parentNode.target === '_blank');
                    $form.find('input[name=nofollow]').get(0).checked = (sel.anchorNode.parentNode.rel === 'nofollow');

                    if (sel.toString() === '') {
                        current = sel.anchorNode.parentNode;
                    }
                } else {
                    $form.find('input[name=text]').val(sel.toString());
                }

                this.selection.save();

                $form.find('button')
                    .on('click', $.proxy(function () {
                        this.selection.restore();
                        var a = $(current || '<a></a>');
                        a.attr('href', $form.find('input[name=url]').val());
                        a.text($form.find('input[name=text]').val());

                        if ($form.find('input[name=target]').get(0).checked) {
                            a.attr('target', '_blank');
                        } else {
                            a.removeAttr('target');
                        }

                        if ($form.find('input[name=nofollow]').get(0).checked) {
                            a.attr('rel', 'nofollow');
                        } else {
                            a.removeAttr('rel');
                        }

                        if (!current) {
                            this.execCommand('insertHTML', false, a.prop('outerHTML'));
                        }
                        this.closeToolbarPopap();
                        this.syncCode();
                        return false;
                    }, this));
                return $form;
            },
            tags: ["a"],
            tooltip: "Insert link"
        },

        video : {
            popap: function () {
                var parent = this,
                    $bylink = $('<form>' +
                        '<input required name="code" placeholder="http://" type="url"/>' +
                        '<button type="submit">' + this.i18n('Insert') + '</button>' +
                        '</form>'),

                    $bycode = $('<form>' +
                        '<textarea required name="code" placeholder="' + parent.i18n('Embed code') + '"></textarea>' +
                        '<button type="submit">' + this.i18n('Insert') + '</button>' +
                        '</form>'),

                    tab = {},
                    insertCode = function (code) {
                        parent.selection.restore();
                        parent.selection.insertHTML(code);
                        parent.closeToolbarPopap();
                        parent.syncCode();
                    };

                tab[parent.icons.getSVGIcon('link') + '&nbsp;' + parent.i18n('Link')] = $bylink;
                tab[parent.icons.getSVGIcon('source') + '&nbsp;' + parent.i18n('Code')] = $bycode;

                parent.selection.save();

                $bycode.on('submit', function () {
                    var $form = $(this);

                    if (!$.trim($form.find('textarea[name=code]').val())) {
                        $form.find('textarea[name=code]').focus().addClass('jodit_error');
                        return false;
                    }

                    insertCode($form.find('textarea[name=code]').val());
                    return false;
                });

                $bylink.on('submit', function () {
                    var $form = $(this);
                    if (!parent.helper.isURL($form.find('input[name=code]').val())) {
                        $form.find('input[name=code]').focus().addClass('jodit_error');
                        return false;
                    }
                    insertCode(parent.helper.convertMediaURLToVideoEmbed($form.find('input[name=code]').val()));
                    return false;
                });

                return parent.form.buildTabs(tab);
            },
            tags: ["iframe"],
            tooltip: "Insert youtube/vimeo video"
        },

        fontsize : {
            command: 'fontSize',
            list : ["8", "9", "10", "11", "12", "14", "18", "24", "30", "36", "48", "60", "72", "96"],
            template : function (i, text) {
                return text;
            },
            tooltip: "Font size"
        },
        font : {
            command: 'applyCSSProperty',
            args: [null, 'font-family'],
            list :  {
                "Helvetica,sans-serif": "Helvetica",
                "Arial,Helvetica,sans-serif": "Arial",
                "Georgia,serif": "Georgia",
                "Impact,Charcoal,sans-serif": "Impact",
                "Tahoma,Geneva,sans-serif": "Tahoma",
                "'Times New Roman',Times,serif": "Times New Roman",
                "Verdana,Geneva,sans-serif": "Verdana"
            },
            template : function (i, text) {
                return '<span style="font-family: ' + i + '"> ' + text + ' </span>';
            },
            tooltip: "Font family"
        },
        paragraph : {
            command: 'formatBlock',
            list: {
                p : "Normal",
                h1 : "Heading 1",
                h2 : "Heading 2",
                h3 : "Heading 3",
                h4 : "Heading 4",
                blockquote : "Quote",
                pre : "Code"
            },
            template : function (name, value) {
                return '<' + name + ' class="jodit_list_element"><span>' + this.i18n(value) + '</span></' + name + '></li>';
            },
            tooltip: "Insert format block"
        },
        table : {
            cols: 10,
            popap: function (elm, control) {
                var self = this,
                    i,
                    j,
                    k,
                    div,
                    $form = $('<form class="jodit_form_inserter">' +
                        '<label>' +
                            '<span>1</span> &times; <span>1</span>' +
                        '</label>' +
                        '</form>'),
                    rows_count = 1,
                    cols_count = 1,
                    default_cols_count = control.cols,
                    rows = $form.find('span').eq(0),
                    cols = $form.find('span').eq(1),
                    cells = [];

                function generateRows(need_rows) {
                    var cnt = (need_rows + 1) * default_cols_count;
                    if (cells.length > cnt) {
                        for (i = cnt; i < cells.length; i += 1) {
                            $form[0].removeChild(cells[i]);
                            delete cells[i];
                        }
                        cells = cells.splice(0, cnt);
                    }
                    for (i = 0; i < cnt; i += 1) {
                        if (!cells[i]) {
                            div = document.createElement('div');
                            div.index = i;
                            cells.push(div);
                        }
                    }
                    $form.append(cells);

                    $form.css('width', ($(cells[0]).outerWidth() * default_cols_count) + 'px');
                }

                generateRows(1);

                cells[0].className = 'hovered';

                $form.on('mousemove', 'div', function mouseenter(index) {
                    k = isNaN(index) ? this.index : index;
                    rows_count = Math.ceil((k + 1) / default_cols_count);
                    cols_count = k % default_cols_count + 1;
                    generateRows(rows_count);

                    if (cols_count === default_cols_count || (cols_count < default_cols_count - 1 && default_cols_count > 10)) {
                        default_cols_count = cols_count === default_cols_count ? default_cols_count + 1 : default_cols_count - 1;
                        return mouseenter(cols_count + (rows_count - 1)  * default_cols_count - 1);
                    }

                    for (i = 0; i < cells.length; i += 1) {
                        if (cols_count >= i % default_cols_count + 1 &&  rows_count >= Math.ceil((i + 1) / default_cols_count)) {
                            cells[i].className = 'hovered';
                        } else {
                            cells[i].className = '';
                        }
                    }

                    cols.text(cols_count);
                    rows.text(rows_count);
                });

                $form.on('mousedown', 'div', function (e) {
                    e.preventDefault();
                    k =  this.index;
                    rows_count = Math.ceil((k + 1) / default_cols_count);
                    cols_count = k % default_cols_count + 1;
                    var table = self.getDocument().createElement('table'), first_td, tr, td, br, w = (100 / cols_count).toFixed(7);
                    for (i = 1; i <= rows_count; i += 1) {
                        tr = self.getDocument().createElement('tr');
                        for (j = 1; j <= cols_count; j += 1) {
                            td = self.getDocument().createElement('td');

                            td.style.width = w + '%';
                            if (!first_td) {
                                first_td = td;
                            }
                            br = self.getDocument().createElement('br');
                            td.appendChild(br);
                            tr.appendChild(self.getDocument().createTextNode("\n"));
                            tr.appendChild(self.getDocument().createTextNode("\t"));
                            tr.appendChild(td);
                        }
                        table.appendChild(self.getDocument().createTextNode("\n"));
                        table.appendChild(tr);
                    }

                    self.selection.insertNode(self.getDocument().createTextNode("\n"));
                    self.selection.insertNode(table);
                    self.selection.moveCursorTo(first_td);

                    self.closeToolbarPopap();
                    self.syncCode();
                });

                return $form;
            },
            tags: ['table'],
            tooltip: "Insert table"
        },
        source : {
            mode: consts.MODE_SPLIT,
            exec: function () {
                this.toggleMode();
            },
            tooltip: "Change mode"
        }
    }
}