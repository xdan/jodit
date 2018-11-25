/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Jodit } from "../Jodit";
import { ToolbarButton } from "../modules/toolbar/button";
import { IDictionary} from "./types";
import { IViewBased } from "./view";

export interface IControlType {
    controlName?: string;
    name?: string;
    mode?: number;
    hotkeys?: string | string[];
    data?: IDictionary;
    isInput?: boolean;

    /**
     * You can use it function for control - active/not active button
     * @param {Jodit} editor
     * @param {IControlType} btn
     * @return {boolean}
     * @see copyformat plugin
     * @example
     * ```javascript
     * var editor = new Jodit('.selectorclass', {
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
    isActive?: (editor: IViewBased | Jodit, control: IControlType, button?: ToolbarButton) => boolean;
    isActiveChild?: (editor: IViewBased | Jodit, control: IControlType, button?: ToolbarButton) => boolean; // for list

    getContent?: (editor: IViewBased | Jodit, control: IControlType, button?: ToolbarButton) => string | HTMLElement;

    /**
     * You can use it function for control - disable/enable button
     *
     * @param {Jodit} editor
     * @param {IControlType} btn
     * @return {boolean}
     * @see copyformat plugin
     * @example
     * ```javascript
     * var editor = new Jodit('.selectorclass', {
     *     buttons: {
     *          checkbox: {
     *              data: {
     *                  enable: false,
     *              },
     *              iconURL: 'checkbox.png',
     *              exec: function (a, b, btn) {
     *                  btn.data.active = !btn.data.active;
     *              },
     *              isDisable: function (editor, btn) {
     *                  return !!btn.data.enable;
     *              }
     *          }
     *     }
     * })
     * ```
     */
    isDisable?: (editor: IViewBased | Jodit, control: IControlType, button?: ToolbarButton) => boolean;
    isDisableChild?: (editor: IViewBased | Jodit, control: IControlType, button?: ToolbarButton) => boolean;

    getLabel?: (editor: IViewBased | Jodit, control: IControlType, button?: ToolbarButton) => boolean | void;

    /**
     * Drop-down list. A hash or array. You must specify the command which will be submitted for the hash key
     * (or array value) (see .[[Jodit.execCommand]] or define 'exec' function. See example
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
     *        exec: (editor, current, control) => {
     *             var key = control.args[0],
     *                value = control.args[1];
     *
     *             if (key === 'clear') {
     *                 this.setEditorValue('');
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
    list?: IDictionary<string> | string[] | string;

    /**
     * The command executes when the button is pressed. Allowed all
     * {@link https://developer.mozilla.org/ru/docs/Web/API/Document/execCommand#commands}
     * and several specific [[Jodit.execCommand]]
     */
    command?: string;
    tagRegExp?: RegExp;

    /**
     * Tag list:  when cursor inward tag from this list, button will be highlighted
     */
    tags?: string[];
    options?: any;
    css?: IDictionary<string|string[]> |  IDictionary<(editor: IViewBased | Jodit, value: string) => boolean>;

    /**
     * String name for existing icons.
     * @example
     * ```javascript
     * var editor = new Jodit('.editor', {
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
     * Use this property if you want set background image for the button. This icon can be 16 * 16 px in SVG or another image formats
     */
    iconURL?: string;

    /**
     * Buttons hint
     */
    tooltip?: string;

    /**
     * This function will be executed when the button is pressed.
     */
    exec?: (editor: IViewBased | Jodit, current: Node|false, control: IControlType, originalEvent: Event,  btn: HTMLLIElement) => void;

    args?: any[];

    /**
     * The method which will be called for each element of button.list
     */
    template?: (editor: IViewBased | Jodit, key: string, value: string) => string;

    /**
     * After click on the button it will show popup element which consist value that this function returned
     * @example
     * ```javascript
     * var editor = new Jodit('.editor', {
     *    buttons: [
     *      {
     *          icon: "insertCode",
     *          popup: function (editor) {
     *              var div = dccument.createElement('div'), button = dccument.createElement('button');
     *              div.innerHTML = 'Hi! Click button and enter your code';
     *              button.innerHTML = 'Click me';
     *
     *              div.appendChild(button);
     *
     *              button.addEventListener('click', function (e) {
     *                  editor.selection.insertHTML(prompt("Enter your code"));
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
        editor: IViewBased | Jodit,
        current: Node | false,
        control: IControlType,
        close: () => void,
        button?: ToolbarButton,
    ) => string | HTMLElement | false;

    defaultValue?: string|string[];
}

export interface IControlTypeStrong extends IControlType {
    name: string;
}

export type Controls =  IDictionary<IControlType |  IDictionary<IControlType>>;
export type Buttons = Array<string | IControlType> | string;
