/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';
import {css, normalizeColor} from '../modules/Helpers';
import {Config} from "../Config";
import {Widget} from "../modules/Widget";
import TabsWidget = Widget.TabsWidget;
import ColorPickerWidget = Widget.ColorPickerWidget;
import {Dom} from "../modules/Dom";
import {ButtonType, ControlType} from "../modules/Toolbar";

Config.prototype.controls.brush = <ControlType>{
    isActive: (editor: Jodit, btn: ControlType, button: ButtonType): boolean => {
        const current: Node|false = editor.selection.current();
        const icon: SVGSVGElement|null = button.btn.querySelector('svg');

        if (current) {
            const currentBpx: HTMLElement = <HTMLElement>Dom.closest(current, (elm: Node): boolean => {
                return Dom.isBlock(elm) || (Dom.isNode(elm, editor.editorWindow) && elm.nodeType === Node.ELEMENT_NODE);
            }, editor.editor) || editor.editor;

            let color: string = css(currentBpx, 'color').toString();
            let bg: string = css(currentBpx, 'background-color').toString();

            if (color !== css(editor.editor, 'color').toString()) {
                icon && (icon.style.fill = color);
                return true;
            }

            if (bg !== css(editor.editor, 'background-color').toString()) {
                icon && (icon.style.fill = bg);
                return true;
            }
        }

        if (icon && icon.style.fill) {
            icon.style.fill = null;
        }

        return false;
    },
    // css: {
    //     'backgroundColor' : (editor: Jodit, color: string) => {
    //         const  check = (colors: {[key:string]:string[]}|string[]) => {
    //             let i: number,
    //                 keys: string[];
    //
    //             if (typeof colors === 'object') {
    //                 keys = Object.keys(colors);
    //                 for (i = 0; i < keys.length; i += 1) {
    //                     if (check(colors[keys[i]])) {
    //                         return true;
    //                     }
    //                 }
    //             } else if (Array.isArray(colors)) {
    //                 return (<Array<string>>colors).indexOf(normalizeColor(color) || '') !== -1;
    //             }
    //             return false;
    //         };
    //
    //         return check(editor.options.colors);
    //     }
    // },
    popup: (editor: Jodit, current: Node | false, self: ControlType, close: Function) => {
        let color: string = '',
            bg_color: string = '',
            tabs: {[key: string]: HTMLElement},
            currentElement: HTMLElement|null = null;

        /* const sel = editor.editorWindow.getSelection(),
             checkRemoveOpportunity = () => {
                 if (current && (!current.hasAttribute("style") || !current.getAttribute("style").length)) {
                     let selInfo = editor.selection.save();
                     while (current.firstChild) {
                         current.parentNode.insertBefore(current.firstChild, current);
                     }
                     current.parentNode.removeChild(current);
                     current = null;
                     editor.selection.restore(selInfo);
                 }
             },
             tryGetCurrent = () => {
                 if (sel && sel.anchorNode) {
                     [sel.anchorNode, sel.anchorNode.parentNode].forEach((elm: HTMLElement) => {
                         if (elm && elm.hasAttribute && elm.hasAttribute("style") && elm.getAttribute('style').indexOf('background') !== -1 && elm.style.backgroundColor) {
                             current = elm;
                             bg_color = editor.editorWindow.getComputedStyle(current).getPropertyValue('background-color');
                         }

                         if (elm && elm.hasAttribute && elm.hasAttribute('style') && elm.getAttribute('style').indexOf('color') !== -1 && elm.style.color) {
                             current = elm;
                             color = current.style.color;
                         }
                     })
                 }
             };*/

        if (current && Dom.isNode(current, editor.editorWindow) && current.nodeType === Node.ELEMENT_NODE) {
            color = css(<HTMLElement>current, 'color').toString();
            bg_color = css(<HTMLElement>current, 'background-color').toString();
            currentElement = <HTMLElement>current;
        }

        const backgroundTag: HTMLElement = ColorPickerWidget(editor, (value: string) => {
            if (!currentElement) {
                editor.execCommand('background', false, value);
            } else {
                currentElement.style.backgroundColor = value;
            }
            close();
        }, bg_color);

        const colorTab: HTMLElement = ColorPickerWidget(editor, (value: string) => {
            if (!currentElement) {
                editor.execCommand('forecolor', false, value);
            } else {
                currentElement.style.color = value;
            }
            close();
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

        return TabsWidget(editor, tabs, <any>currentElement);
    },
    tooltip: "Fill color or set the text color"
};


export function color(editor: Jodit) {
    editor.events.on('beforeCommand', (command: string, second: string, third: string): false | void => {
        if (/forecolor|background/.test(command)) {
            const color: string|false = normalizeColor(third);

            switch (command) {
                case 'background':
                    editor.selection.applyCSS({
                        backgroundColor: !color ? '' : <string>color
                    });
                    break;
                case 'forecolor':
                    editor.selection.applyCSS({
                        color: !color ? '' : <string>color
                    });
                    break;
            }

            editor.setEditorValue();
            return false;
        }
    });
}