/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module config
 */

import type {
	IExtraPlugin,
	IDictionary,
	IViewOptions,
	NodeFunction,
	Attributes,
	ButtonsOption,
	Controls,
	IControlType,
	IUIButtonState,
	Nullable
} from './types';
import * as consts from './core/constants';

/**
 * Default Editor's Configuration
 */
export class Config implements IViewOptions {
	namespace: string = '';

	/**
	 * Editor loads completely without plugins. Useful when debugging your own plugin.
	 */
	safeMode: boolean = false;

	/**
	 * List of plugins that will be initialized in safe mode.
	 *
	 * ```js
	 * Jodit.make('#editor', {
	 * 	safeMode: true,
	 * 	safePluginsList: ['about'],
	 * 	extraPlugins: ['yourPluginDev']
	 * });
	 * ```
	 */
	safePluginsList: string[] = ['about', 'enter', 'backspace'];

	/**
	 * When this option is enabled, the editor's content will be placed in an iframe and isolated from the rest of the page.
	 *
	 * @example
	 * ```javascript
	 * new Jodit('#editor', {
	 *    iframe = true;
	 *    iframeStyle = 'html{margin: 0px;}body{padding:10px;background:transparent;color:#000;position:relative;z-index:2;\
	 *    user-select:auto;margin:0px;overflow:hidden;}body:after{content:"";clear:both;display:block}';
	 * });
	 * ```
	 */
	iframe: boolean = false;

	commandToHotkeys!: IDictionary<string | string[]>;

	license: string = '';

	preset: string = 'custom';

	presets: IDictionary = {
		inline: {
			inline: true,
			toolbar: false,
			toolbarInline: true,
			toolbarInlineForSelection: true,
			showXPathInStatusbar: false,
			showCharsCounter: false,
			showWordsCounter: false,
			showPlaceholder: false
		}
	};

	ownerDocument: Document = (typeof document !== 'undefined'
		? document
		: null) as Document;

	ownerWindow: Window = (typeof window !== 'undefined'
		? window
		: null) as Window;

	/**
	 * Shadow root if Jodit was created in it
	 */
	shadowRoot: Nullable<ShadowRoot> = null;

	/**
	 * Dictionary of variable values in css, a complete list can be found here
	 * https://github.com/xdan/jodit/blob/master/src/styles/variables.less#L25
	 *
	 * @example
	 * ```js
	 * const editor = Jodit.make('#editor', {
	 *   styleValues: {
	 *		'color-text': 'red',
	 *		colorBorder: 'black',
	 *		'color-panel': 'blue'
	 *   }
	 * });
	 * ```
	 */
	styleValues: IDictionary = {};

	/**
	 * z-index For editor
	 */
	zIndex: number = 0;

	/**
	 * Change the read-only state of the editor
	 */
	readonly: boolean = false;

	/**
	 * Change the disabled state of the editor
	 */
	disabled: boolean = false;

	activeButtonsInReadOnly: string[] = [
		'source',
		'fullsize',
		'print',
		'about',
		'dots',
		'selectall'
	];

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
	toolbarButtonSize: IUIButtonState['size'] = 'middle';

	/**
	 * Allow navigation in the toolbar of the editor by Tab key
	 */
	allowTabNavigation: boolean = false;

	/**
	 * Inline editing mode
	 */
	inline: boolean = false;

	/**
	 * Theme (can be "dark")
	 * @example
	 * ```javascript
	 * var editor  = new  Jodit(".dark_editor", {
	 *      theme: "dark"
	 * });
	 * ```
	 */
	theme: string = 'default';

	/**
	 * if set true then the current mode is saved in a cookie , and is restored after a reload of the page
	 */
	saveModeInStorage: boolean = false;

	/**
	 * Options specifies whether the editor is to have its spelling and grammar checked or not
	 * @see {@link http://www.w3schools.com/tags/att_global_spellcheck.asp}
	 */
	spellcheck: boolean = true;

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
	editorCssClass: false | string = false;

	/**
	 * The font of editor
	 *
	 * @example
	 * ```javascript
	 * new Jodit('#editor', {
	 * 		style: {
	 * 		 font: '12px Arial'
	 * 		}
	 * });
	 * ```
	 */
	style: false | IDictionary = false;

	/**
	 * After all changes in editors for textarea will call change trigger
	 *
	 * @example
	 * ```javascript
	 * var editor = new Jodit('#editor');
	 * document.getElementById('editor').addEventListener('change', function () {
	 *      console.log(this.value);
	 * })
	 * ```
	 */
	triggerChangeEvent: boolean = true;

	/**
	 * The writing direction of the language which is used to create editor content. Allowed values are: ''
	 * (an empty string) – Indicates that content direction will be the same as either the editor UI direction or
	 * the page element direction. 'ltr' – Indicates a Left-To-Right text direction (like in English).
	 * 'rtl' – Indicates a Right-To-Left text direction (like in Arabic).
	 * @example
	 * ```javascript
	 * new Jodit('.editor', {
	 *    direction: 'rtl'
	 * })
	 * ```
	 */
	direction: 'rtl' | 'ltr' | '' = '';

	/**
	 * Language by default. if `auto` language set by document.documentElement.lang ||
	 * (navigator.language && navigator.language.substr(0, 2)) ||
	 * (navigator.browserLanguage && navigator.browserLanguage.substr(0, 2)) || 'en'
	 *
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
	language: string = 'auto';

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
	debugLanguage: boolean = false;

	/**
	 * Collection of language pack data `{en: {'Type something': 'Type something', ...}}`
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
	i18n: false = false;

	/**
	 * The tabindex global attribute is an integer indicating if the element can take
	 * input focus (is focusable), if it should participate to sequential keyboard navigation,
	 * and if so, at what position. It can take several values
	 */
	tabIndex: number = -1;

	/**
	 * Boolean, whether the toolbar should be shown.
	 * Alternatively, a valid css-selector-string to use an element as toolbar container.
	 */
	toolbar: boolean | string | HTMLElement = true;

	/**
	 * Boolean, whether the statusbar should be shown.
	 */
	statusbar: boolean = true;

	/**
	 * Show tooltip after mouse enter on the button
	 */
	showTooltip: boolean = true;

	/**
	 * Delay before show tooltip
	 */
	showTooltipDelay: number = 1000;

	/**
	 * Instead of create custop tooltip - use native title tooltips
	 */
	useNativeTooltip: boolean = false;

	// TODO
	// autosave: false, // false or url
	// autosaveCallback: false, // function
	// interval: 60, // seconds
	// TODO

	/**
	 * Element that will be created when you press Enter
	 */
	enter: 'p' | 'div' | 'br' = consts.PARAGRAPH;

	/**
	 * Use when you need insert new block element
	 * use enter option if not set
	 */
	enterBlock: 'p' | 'div' =
		this.enter !== 'br' ? this.enter : consts.PARAGRAPH;

	/**
	 * Jodit.MODE_WYSIWYG The HTML editor allows you to write like MSWord,
	 * Jodit.MODE_SOURCE syntax highlighting source editor
	 * @example
	 * ```javascript
	 * var editor = new Jodit('#editor', {
	 *     defaultMode: Jodit.MODE_SPLIT
	 * });
	 * console.log(editor.getRealMode())
	 * ```
	 */
	defaultMode: number = consts.MODE_WYSIWYG;

	/**
	 * Use split mode
	 */
	useSplitMode: boolean = false;

	/**
	 * The colors in HEX representation to select a color for the background and for the text in colorpicker
	 * @example
	 * ```javascript
	 *  new Jodit('#editor', {
	 *     colors: ['#ff0000', '#00ff00', '#0000ff']
	 * })
	 * ```
	 */
	colors: IDictionary<string[]> | string[] = {
		greyscale: [
			'#000000',
			'#434343',
			'#666666',
			'#999999',
			'#B7B7B7',
			'#CCCCCC',
			'#D9D9D9',
			'#EFEFEF',
			'#F3F3F3',
			'#FFFFFF'
		],
		palette: [
			'#980000',
			'#FF0000',
			'#FF9900',
			'#FFFF00',
			'#00F0F0',
			'#00FFFF',
			'#4A86E8',
			'#0000FF',
			'#9900FF',
			'#FF00FF'
		],
		full: [
			'#E6B8AF',
			'#F4CCCC',
			'#FCE5CD',
			'#FFF2CC',
			'#D9EAD3',
			'#D0E0E3',
			'#C9DAF8',
			'#CFE2F3',
			'#D9D2E9',
			'#EAD1DC',
			'#DD7E6B',
			'#EA9999',
			'#F9CB9C',
			'#FFE599',
			'#B6D7A8',
			'#A2C4C9',
			'#A4C2F4',
			'#9FC5E8',
			'#B4A7D6',
			'#D5A6BD',
			'#CC4125',
			'#E06666',
			'#F6B26B',
			'#FFD966',
			'#93C47D',
			'#76A5AF',
			'#6D9EEB',
			'#6FA8DC',
			'#8E7CC3',
			'#C27BA0',
			'#A61C00',
			'#CC0000',
			'#E69138',
			'#F1C232',
			'#6AA84F',
			'#45818E',
			'#3C78D8',
			'#3D85C6',
			'#674EA7',
			'#A64D79',
			'#85200C',
			'#990000',
			'#B45F06',
			'#BF9000',
			'#38761D',
			'#134F5C',
			'#1155CC',
			'#0B5394',
			'#351C75',
			'#733554',
			'#5B0F00',
			'#660000',
			'#783F04',
			'#7F6000',
			'#274E13',
			'#0C343D',
			'#1C4587',
			'#073763',
			'#20124D',
			'#4C1130'
		]
	};

	/**
	 * The default tab color picker
	 * @example
	 * ```javascript
	 *  new Jodit('#editor2', {
	 *     colorPickerDefaultTab: 'color'
	 * })
	 * ```
	 */
	colorPickerDefaultTab: 'background' | 'color' = 'background';

	/**
	 * Image size defaults to a larger image
	 */
	imageDefaultWidth: number = 300;

	/**
	 * Do not display these buttons that are on the list
	 * @example
	 * ```javascript
	 * Jodit.make('#editor2', {
	 *     removeButtons: ['hr', 'source']
	 * });
	 * ```
	 */
	removeButtons: string[] = [];

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
	disablePlugins: string[] | string = [];

	/**
	 * Init and download extra plugins
	 * @example
	 * ```typescript
	 * var editor = new Jodit('.editor', {
	 *    extraPlugins: ['emoji']
	 * });
	 * ```
	 * It will try load %SCRIPT_PATH%/plugins/emoji/emoji.js and after load will try init it
	 */
	extraPlugins: Array<string | IExtraPlugin> = [];

	/**
	 * Base path for download extra plugins
	 */
	basePath?: string;

	/**
	 * This buttons list will be added to option.buttons
	 */
	extraButtons: Array<string | IControlType> = [];

	/**
	 * By default, you can only install an icon from the Jodit suite.
	 * You can add your icon to the set using the `Jodit.modules.Icon.set (name, svg Code)` method.
	 * But for a declarative declaration, you can use this option.
	 *
	 * @example
	 * ```js
	 * Jodit.modules.Icon.set('someIcon', '<svg><path.../></svg>');
	 * const editor = Jodit.make({
	 *   extraButtons: [{
	 *     name: 'someButton',
	 *     icon: 'someIcon'
	 *   }]
	 * });
	 *
	 * @example
	 * const editor = Jodit.make({
	 *   extraIcons: {
	 *     someIcon: '<svg><path.../></svg>'
	 *   },
	 *   extraButtons: [{
	 *     name: 'someButton',
	 *     icon: 'someIcon'
	 *   }]
	 * });
	 * ```
	 * @example
	 * ```js
	 * const editor = Jodit.make({
	 *   extraButtons: [{
	 *     name: 'someButton',
	 *     icon: '<svg><path.../></svg>'
	 *   }]
	 * });
	 * ```
	 */
	extraIcons: IDictionary<string> = {};

	/**
	 * Default attributes for created inside editor elements
	 */
	createAttributes: IDictionary<Attributes | NodeFunction> = {};

	/**
	 * The width of the editor, accepted as the biggest. Used to the responsive version of the editor
	 */
	sizeLG: number = 900;

	/**
	 * The width of the editor, accepted as the medium. Used to the responsive version of the editor
	 */
	sizeMD: number = 700;

	/**
	 * The width of the editor, accepted as the small. Used to the responsive version of the editor
	 */
	sizeSM: number = 400;

	/**
	 * The list of buttons that appear in the editor's toolbar on large places (≥ options.sizeLG).
	 * Note - this is not the width of the device, the width of the editor
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
	 *             div.textContent = this.val();
	 *             dialog.setHeader('Source code');
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
	 *             this.s.insertNode(this.c.element(key, ''));
	 *             this.e.fire('errorMessage', 'Was inserted ' + value);
	 *        },
	 *        template: function (key, value) {
	 *            return '<div>' + value + '</div>';
	 *        }
	 *  });
	 * ```
	 */
	buttons: ButtonsOption = [
		{
			group: 'font-style',
			buttons: []
		},
		{
			group: 'list',
			buttons: []
		},
		{
			group: 'indent',
			buttons: []
		},
		{
			group: 'font',
			buttons: []
		},
		{
			group: 'color',
			buttons: []
		},
		'---',
		{
			group: 'script',
			buttons: []
		},
		{
			group: 'media',
			buttons: []
		},
		'\n',
		{
			group: 'state',
			buttons: []
		},
		{
			group: 'clipboard',
			buttons: []
		},
		{
			group: 'insert',
			buttons: []
		},
		{
			group: 'form',
			buttons: []
		},
		'---',
		{
			group: 'history',
			buttons: []
		},
		{
			group: 'search',
			buttons: []
		},
		{
			group: 'source',
			buttons: []
		},
		{
			group: 'other',
			buttons: []
		},
		{
			group: 'info',
			buttons: []
		}
	];

	/**
	 * The list of buttons that appear in the editor's toolbar on medium places (≥ options.sizeMD).
	 */
	buttonsMD: ButtonsOption = [
		'bold',
		'italic',
		'|',
		'ul',
		'ol',
		'eraser',
		'|',
		'font',
		'fontsize',
		'brush',
		'paragraph',
		'align',
		'---',
		'image',
		'table',
		'|',
		'link',
		'\n',
		'hr',
		'copyformat',
		'fullsize',
		'---',
		'undo',
		'redo',
		'|',
		'dots'
	];

	/**
	 * The list of buttons that appear in the editor's toolbar on small places (≥ options.sizeSM).
	 */
	buttonsSM: ButtonsOption = [
		'bold',
		'italic',
		'|',
		'ul',
		'ol',
		'eraser',
		'|',
		'fontsize',
		'brush',
		'paragraph',
		'---',
		'image',
		'table',
		'\n',
		'link',
		'|',
		'align',
		'|',
		'undo',
		'redo',
		'|',
		'copyformat',
		'fullsize',
		'---',
		'dots'
	];

	/**
	 * The list of buttons that appear in the editor's toolbar on extra small places `(< options.sizeSM)`.
	 */
	buttonsXS: ButtonsOption = [
		'bold',
		'brush',
		'paragraph',
		'eraser',
		'---',
		'image',
		'\n',
		'align',
		'undo',
		'redo',
		'---',
		'dots'
	];

	/**
	 * Behavior for buttons
	 */
	controls!: Controls;

	events: IDictionary<(...args: any[]) => any> = {};

	/**
	 * Buttons in toolbat without SVG - only texts
	 */
	textIcons: boolean = false;

	/**
	 * shows a INPUT[type=color] to open the browser color picker, on the right bottom of widget color picker
	 */
	showBrowserColorPicker: boolean = true;

	private static __defaultOptions: Config;

	static get defaultOptions(): Config {
		if (!Config.__defaultOptions) {
			Config.__defaultOptions = new Config();
		}

		return Config.__defaultOptions;
	}
}

Config.prototype.controls = {};
