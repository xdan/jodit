/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module types
 */

import type {
	HTMLTagNames,
	IComponent,
	IDictionary,
	Modes,
	Nullable,
	IViewBased,
	IJodit,
	IMods,
	IBound,
	IContainer
} from './';
import type { IFileBrowser } from './file-browser';

import type { IUIButton, IUIElement, IUIList } from './ui';

interface IControlType<
	T extends IViewBased = IJodit | IViewBased | IFileBrowser,
	B = IToolbarButton
> {
	name?: string;
	text?: string;

	mode?: Modes;
	hotkeys?: string | string[];
	data?: IDictionary;

	update?: (button: B, editor: T) => void;
	isInput?: boolean;

	/**
	 * You can use it function for control - active/not active button
	 *
	 * @see copyformat plugin
	 * @example
	 * ```javascript
	 * var editor = Jodit.make('.selectorclass', {
	 *     buttons: {
	 *          checkbox: {
	 *              data: {
	 *                  active: false,
	 *              },
	 *              iconURL: 'checkbox.png',
	 *              exec: function (a, b, btn) {
	 *                  btn.data.active = !btn.data.active;
	 *              },
	 *              isActive: function (editor, btn) {
	 *                  return !!btn.data.active;
	 *              }
	 *          }
	 *     }
	 * })
	 * ```
	 */
	isActive?: (editor: T, control: IControlType<T, B>, button?: B) => boolean;

	isChildActive?: (
		editor: T,
		control: IControlType<T, B>,
		button?: B
	) => boolean; // for list

	getContent?: (
		editor: T,
		control: IControlType<T, B>,
		button: B
	) => string | HTMLElement;

	/**
	 * You can use it function for control - disable/enable button
	 *
	 * @see copyformat plugin
	 * @example
	 * ```javascript
	 * var editor = Jodit.make('.selectorclass', {
	 *     buttons: {
	 *          checkbox: {
	 *              data: {
	 *                  enable: false,
	 *              },
	 *              iconURL: 'checkbox.png',
	 *              exec: function (a, b, btn) {
	 *                  btn.data.active = !btn.data.active;
	 *              },
	 *              isDisabled: function (editor, btn) {
	 *                  return !!btn.data.enable;
	 *              }
	 *          }
	 *     }
	 * })
	 * ```
	 */
	isDisabled?: (
		editor: T,
		control: IControlType<T, B>,
		button?: B
	) => boolean;

	isChildDisabled?: (
		editor: T,
		control: IControlType<T, B>,
		button?: B
	) => boolean;

	/**
	 * Drop-down list. A hash or array. You must specify the command which will be submitted for the hash key
	 * (or array value) (see .[[IJodit.execCommand]] or define 'exec' function. See example
	 * @example
	 * ```javascript
	 * Jodit.make('#editor2', {
	 *     buttons: Jodit.defaultOptions.buttons.concat([{
	 *        name: 'listsss',
	 *        iconURL: 'stuf/dummy.png',
	 *        list: {
	 *            h1: 'insert Header 1',
	 *            h2: 'insert Header 2',
	 *            clear: 'Empty editor',
	 *        },
	 *        exec: (editor, current, control) => {
	 *             var key = control.args[0],
	 *                value = control.args[1];
	 *
	 *             if (key === 'clear') {
	 *                 this.setEditorValue('');
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
	list?:
		| IDictionary<string | number>
		| string[]
		| number[]
		| IControlType[]
		| IControlListItem[];

	/**
	 * The command executes when the button is pressed. Allowed all
	 * @see https://developer.mozilla.org/ru/docs/Web/API/Document/execCommand#commands
	 * and several specific [[IJodit.execCommand]]
	 */
	command?: string;
	tagRegExp?: RegExp;

	/**
	 * Tag list:  when cursor inward tag from this list, button will be highlighted
	 */
	tags?: HTMLTagNames[];

	css?: IDictionary<string | string[]>;

	/**
	 * String name for existing icons.
	 * @example
	 * ```javascript
	 * var editor = Jodit.make('.editor', {
	 *  buttons: [
	 *      {
	 *          icon: 'source',
	 *          exec: function (editor) {
	 *              editor.toggleMode();
	 *          }
	 *      }
	 *  ]
	 * })
	 * ```
	 */
	icon?: string;

	/**
	 * Use this property if you want set background image for the button. This icon can be 16 * 16 px in SVG or
	 * another image formats
	 */
	iconURL?: string;

	/**
	 * Buttons hint
	 */
	tooltip?:
		| string
		| ((editor: T, control: IControlType<T, B>, button?: B) => string);

	/**
	 * This function will be executed when the button is pressed.
	 */
	exec?: (
		view: T,
		current: Nullable<Node>,
		options: {
			control: IControlType<T, B>;
			originalEvent: Event;
			button: IToolbarButton;
		}
	) => any;

	/**
	 * Allows you to set a separate handler for list items
	 * @example
	 * ```javascript
	 * Jodit.make('.editor', {
	 * 	buttons: [
	 * 		{
	 * 			name: 'add-date',
	 * 			iconURL: 'stuf/dummy.png',
	 * 			list: {
	 * 				options: 'Open options',
	 * 			},
	 * 			exec(editor, current, control) {
	 * 				editor.s.insertHTML(new Date().toString());
	 * 			},
	 * 			childExec(editor, current, control) {
	 * 				if (control.args[0] === 'options') {
	 * 					editor.alert('Options');
	 * 				}
	 * 			}
	 * 		}
	 * 	]
	 * })
	 * ```
	 */
	childExec?: (
		view: T,
		current: Nullable<Node>,
		options: {
			parentControl: IControlType<T, B>;
			control: IControlType<T, B>;
			originalEvent: Event;
			button: IToolbarButton;
		}
	) => any;

	args?: any[];

	/**
	 * The method which will be called for each element of button.list
	 */
	template?: (jodit: T, key: string, value: string) => string;
	childTemplate?: (
		jodit: T,
		key: string,
		value: string,
		button: IToolbarButton
	) => string;

	/**
	 * After click on the button it will show popup element which consist value that this function returned
	 * @example
	 * ```javascript
	 * var editor = Jodit.make('.editor', {
	 *    buttons: [
	 *      {
	 *          icon: "insertCode",
	 *          popup: function (editor) {
	 *              var div = document.createElement('div'), button = dccument.createElement('button');
	 *              div.innerHTML = 'Hi! Click button and enter your code';
	 *              button.innerHTML = 'Click me';
	 *
	 *              div.appendChild(button);
	 *
	 *              button.addEventListener('click', function (e) {
	 *                  editor.s.insertHTML(prompt("Enter your code"));
	 *                  return false;
	 *              });
	 *              return div;
	 *          }
	 *      }
	 *    ]
	 * });
	 * ```
	 */
	popup?: (
		jodit: T,
		current: Nullable<Node>,
		control: IControlType<T, B>,
		close: () => void,
		button: B
	) => string | HTMLElement | IUIElement | false;

	defaultValue?: string | string[];

	mods?: IMods['mods'];
}

interface IControlListItem {
	title: string;
	value: string;
}

interface IControlTypeStrong extends IControlType {
	name: NonNullable<IControlType['name']>;
}

interface IControlTypeContent extends IControlTypeStrong {
	getContent: NonNullable<IControlTypeStrong['getContent']>;
}

export interface Controls<T extends IViewBased = IJodit | IViewBased> {
	[controlName: string]: IControlType<T> | Controls<T>;
}

export type Buttons = Array<string | IControlType>;

export type ButtonGroup =
	| string
	| 'source'
	| 'font-style'
	| 'script'
	| 'list'
	| 'indent'
	| 'font'
	| 'color'
	| 'media'
	| 'state'
	| 'clipboard'
	| 'insert'
	| 'history'
	| 'search'
	| 'other'
	| 'info';

export interface ButtonsGroup {
	group: ButtonGroup;
	buttons: Buttons;
}

export type ButtonsGroups = Array<IControlType | string | ButtonsGroup>;
export type ButtonsOption = string | ButtonsGroups;

type RequireKeys<T extends object, K extends keyof T> = Required<Pick<T, K>> &
	Omit<T, K>;

type IControlTypeStrongList = RequireKeys<IControlTypeStrong, 'list'>;

interface IToolbarButton extends IUIButton {
	control: IControlTypeStrong;
	target: Nullable<HTMLElement>;
}

interface IToolbarCollection extends IUIList {
	setDirection(direction: 'rtl' | 'ltr'): void;

	firstButton: Nullable<IToolbarButton>;

	shouldBeDisabled(button: IToolbarButton): boolean | void;
	shouldBeActive(button: IToolbarButton): boolean | void;
	getTarget(button: IToolbarButton): Node | null;

	show(): void;
	hide(): void;
	showInline(bound?: IBound): void;
}

export interface IStatusBar extends IContainer, IComponent, IMods {
	show(): void;
	hide(): void;
	isShown: boolean;

	getHeight(): number;
	append(el: HTMLElement, inTheRight?: boolean): void;
}

export interface IProgressBar extends IUIElement {
	show(): IProgressBar;
	hide(): IProgressBar;

	progress(percentage: number): IProgressBar;
}
