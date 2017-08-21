import Jodit from '../Jodit';
import {normalizeColor} from '../modules/Helpers';
import {Config} from "../Config";
import {Widget} from "../modules/Widget";
import TabsWidget = Widget.TabsWidget;
import ColorPickerWidget = Widget.ColorPickerWidget;

Config.prototype.controls.brush = {
    css: {
        'backgroundColor' : (editor: Jodit, color: string) => {
            const  check = (colors: {[key:string]:string[]}|string[]) => {
                let i, keys;
                if (typeof colors === 'object') {
                    keys = Object.keys(colors);
                    for (i = 0; i < keys.length; i += 1) {
                        if (check(colors[keys[i]])) {
                            return true;
                        }
                    }
                } else if (Array.isArray(colors)) {
                    return (<Array<string>>colors).indexOf(normalizeColor(color) || '') !== -1;
                }
                return false;
            };

            return check(editor.options.colors);
        }
    },
    popup: (editor: Jodit, current, self, close) => {
        let color: string = '',
            bg_color: string = '',
            tabs: {[key: string]: HTMLElement};
        /* const sel = editor.win.getSelection(),
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
                             bg_color = editor.win.getComputedStyle(current).getPropertyValue('background-color');
                         }

                         if (elm && elm.hasAttribute && elm.hasAttribute('style') && elm.getAttribute('style').indexOf('color') !== -1 && elm.style.color) {
                             current = elm;
                             color = current.style.color;
                         }
                     })
                 }
             };*/

        //tryGetCurrent();

        //const widget = new (require('./modules/Widget').default)(editor);

        const backgroundTag: HTMLElement = ColorPickerWidget(editor, (value: string) => {
            //if (!current) {
            editor.execCommand('background', false, value);
            close();
            //tryGetCurrent();
            // } else {
            //     current.style.backgroundColor = value;
            //   }
            //checkRemoveOpportunity();
        }, bg_color);

        const colorTab: HTMLElement = ColorPickerWidget(editor, (value: string) => {
            // if (!current) {
            editor.execCommand('forecolor', false, value);
            close();
            //     tryGetCurrent();
            // } else {
            //    current.style.color = value;
            // }
            //checkRemoveOpportunity();
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

        return TabsWidget(editor, tabs);
    },
        tooltip: "Fill color or set the text color"
};


Jodit.plugins.color = function (editor: Jodit) {
    editor.events.on('beforeCommand', (command, second, third) => {
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
};