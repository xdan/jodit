/**
* Module popup edit img elements and table
* @module popup
* @params {Object} parent Jodit main object
*/
import Jodit from "../Jodit";
import Toolbar from "../modules/Toolbar";
import {Config} from '../Config'
import {css, dom, offset} from "../modules/Helpers";
import {ControlType} from "../modules/Toolbar";
import Dom from "../modules/Dom";
import Table from "../modules/Table";
import {Widget} from "../modules/Widget";
import ColorPickerWidget = Widget.ColorPickerWidget;
import TabsWidget = Widget.TabsWidget;

declare module "../Config" {
    interface Config {
        popup: {[key: string]: Array<ControlType|string>}
    }
}
/**
 * @property{object} popup plugin options
 * @property{array} popup.img List of buttons toWYSIWYG the toolbar pop-up window in the image
 * @property{array} popup.table List of buttons toWYSIWYG the toolbar pop-up window at the tables
 * @example
 * ```javascript
 * new Jodit('#editor', {
 *     popup: {
 *         img: [
 *             {name: 'bin'},
 *             {
 *                  name: 'pencil',
 *                  exec: function (image) {
 *                      if (Jodit.plugins.image.open) {
 *                          Jodit.plugins.image.open.call(image);
 *                      }
 *                  }
 *              }
 *         ],
 *         table: [
 *              'splitv',
 *              'splitg', "\n",
 *              'merge', "|",
 *              {
 *                  name: 'bin',
 *                  list: {
 *                      'bin': 'Delete table',
 *                      'binrow': 'Delete row',
 *                      'bincolumn': 'Delete column',
 *                      'empty': 'Empty cell'
 *                  }
 *              }
 *         ]
 *     }
 * });
 * ```
 */
Config.prototype.popup = {
    a: [
        {
            name: 'eye',
            tooltip: 'Open link',
            exec: (editor: Jodit, current: HTMLAnchorElement) => {
                if (current && current.getAttribute('href')) {
                    editor.ownerWindow.open(current.getAttribute('href'));
                }
            }
        },
        {
            name: 'link',
            tooltip: 'Edit link',
            icon: 'pencil'
        },
        'unlink',
        'brush'
    ],
    img: [
        {
            name: 'bin',
            tooltip: 'Delete',
            exec: (editor: Jodit, image: HTMLElement) => {
                image.parentNode.removeChild(image);
            }
        },
        {
            name: 'pencil',
            exec: function (editor: Jodit, current: Node) {
                const tagName: string = (<HTMLElement>current).tagName.toLowerCase();
                if (tagName === 'img') {
                    editor.events.fire(editor,'openImageProperties', [current]);
                }
            },
            tooltip: 'Edit'
        },
        {
            name: 'valign',
            list: [
                'Top',
                'Middle',
                'Bottom'
            ],
            tooltip: 'Vertical align',
            exec: (editor: Jodit, image: HTMLImageElement, control: ControlType) => {
                const tagName: string = (<HTMLElement>image).tagName.toLowerCase();
                if (tagName !== 'img') {
                    return;
                }
                const command = control.args[1].toLowerCase();
                css(image, 'vertical-align', command);
            }
        },
        {
            name: 'left',
            list: [
                'Left',
                'Right',
                'Center',
                'Normal'
            ],
            exec: (editor: Jodit, image: HTMLImageElement, control: ControlType) => {
                const tagName: string = (<HTMLElement>image).tagName.toLowerCase();
                if (tagName !== 'img') {
                    return;
                }

                const clearCenterAlign = () => {
                    if (css(image, 'display') === 'block') {
                        css(image, 'display', '');
                    }
                    if (image.style.marginLeft === 'auto' && image.style.marginRight === 'auto') {
                        image.style.marginLeft =  '';
                        image.style.marginRight =  '';
                    }
                };

                const command = control.args[1].toLowerCase();

                if (command !== 'normal') {
                    if (['right', 'left'].indexOf(command) !== -1) {
                        css(image, 'float', command);
                        clearCenterAlign();
                    } else {
                        css(image, 'float', '');
                        css(image, {
                            'display': 'block',
                            'margin-left': 'auto',
                            'margin-right': 'auto'
                        });
                    }
                } else {
                    if (css(image, 'float') && ['right', 'left'].indexOf((<string>css(image, 'float')).toLowerCase()) !== -1) {
                        css(image, 'float', '');
                    }
                    clearCenterAlign();
                }
            },
            tooltip: 'Horizontal align'
        }
    ],
    table: [
        {
            name: 'brush',
            popup: function (editor: Jodit, elm: HTMLTableElement, control: ControlType, close: Function) {
                let $bg: HTMLElement,
                    $cl: HTMLElement,
                    $br: HTMLElement,
                    $tab: HTMLElement,
                    selected: HTMLTableCellElement[] = Table.getAllSelectedCells(elm),
                    color: string,
                    br_color: string,
                    bg_color: string;

                if (!selected.length) {
                    return false;
                }

                color = <string>css(selected[0], 'color');
                bg_color = <string>css(selected[0], 'background-color');
                br_color = <string>css(selected[0], 'border-color');


                $bg = ColorPickerWidget(editor, (value: string) => {
                    selected.forEach((cell: HTMLTableCellElement) => {
                        css(cell, 'background-color', value);
                    });
                    close();
                }, bg_color);

                $cl = ColorPickerWidget(editor,(value: string) => {
                    selected.forEach((cell: HTMLTableCellElement) => {
                        css(cell, 'color', value);
                    });
                    close();
                }, color);

                $br = ColorPickerWidget(editor,(value: string) => {
                    selected.forEach((cell: HTMLTableCellElement) => {
                        css(cell, 'border-color', value);
                    });
                    close();
                }, br_color);

                $tab = TabsWidget(editor, {
                    Background : $bg,
                    Text : $cl,
                    Border : $br,
                });

                return $tab;
            },
            tooltip: 'Background'
        },
        {
            name: 'valign',
            list: [
                'Top',
                'Middle',
                'Bottom'
            ],
            exec: (editor: Jodit, table: HTMLTableElement, control: ControlType) => {
                const command = control.args[1].toLowerCase();
                Table.getAllSelectedCells(table).forEach((cell: HTMLTableCellElement) => {
                    css(cell, 'vertical-align', command);
                })
            },
            tooltip: 'Vertical align'
        },
        //'|',
        {
            name: 'splitv',
            command: 'tablesplitv',
            tooltip: 'Split vertical'
        },
        {
            name: 'splitg',
            command: 'tablesplitg',
            tooltip: 'Split horizontal'
        },
        "\n",
        {
            name: 'merge',
            command: 'tablemerge',
            tooltip: 'Merge'
        },
        {
            name: 'addcolumn',
            list: {
                tableaddcolumnbefore: 'Insert column before',
                tableaddcolumnafter: 'Insert column after'
            },
            exec: (editor: Jodit, table: HTMLTableElement, control: ControlType) => {
                const command = control.args[0].toLowerCase();
                editor.execCommand(command, false, table);
            },
            tooltip: 'Add column'
        },
        {
            name: 'addrow',
            list: {
                tableaddrowbefore: 'Insert row above',
                tableaddrowafter: 'Insert row below'
            },
            exec: (editor: Jodit, table: HTMLTableElement, control: ControlType) => {
                const command = control.args[0].toLowerCase();
                editor.execCommand(command, false, table);
            },
            tooltip: 'Add row'
        },
        {
            name: 'bin',
            list: {
                tablebin: 'Delete table',
                tablebinrow: 'Delete row',
                tablebincolumn: 'Delete column',
                tableempty: 'Empty cell'
            },
            exec: (editor: Jodit, table: HTMLTableElement, control: ControlType) => {
                const command = control.args[0].toLowerCase();
                editor.execCommand(command, false, table);
            },
            tooltip: 'Delete'
        }
    ]
};

export default function (editor: Jodit) {
    let timeout: number;
    const toolbar: Toolbar = new Toolbar(editor),
        popup: HTMLDivElement = <HTMLDivElement> dom('<div class="jodit_toolbar_popup-inline"></div>', editor.ownerDocument),

        toogleEditor = (toggle: boolean) => {
            if (editor.container) {
                editor.container.classList.toggle('jodit_popup_active', toggle);
            }
        },

        hidePopup = () => {
            popup
                .classList.remove('active');
            toogleEditor(false);
        },

        showPopup = (elm: HTMLElement, x: number, y: number) => {

            const tagName: string = elm.tagName.toLowerCase();

            if (editor.options.popup[tagName] === undefined) {
                return;
            }

            popup.innerHTML = '';

            toolbar.build(editor.options.popup[tagName], popup, elm);

            popup.classList
                .add('active');

            css(popup, {
                left: x + 'px',
                top: y + 'px',
                marginLeft: -Math.round(popup.offsetWidth / 2) + 'px'
            });

            toogleEditor(true);
        },

        delayShowPopup = (elm: HTMLElement, x: number, y: number) => {
            clearTimeout(timeout);
            if (editor.options.observer.timeout) {
                timeout = setTimeout(showPopup.bind(editor, elm, x, y), editor.options.observer.timeout);
            } else {
                showPopup(elm, x, y);
            }
        };

    /**
     * @method init
     */

    editor.events
        .on('hidePopup afterCommand keydown resize', hidePopup)
        .on('showPopap', delayShowPopup)
        .on('afterInit', () => {
            editor.editorDocument.body
                .appendChild(popup);
            editor.__on(popup,'mousedown', (e: MouseEvent) => {
                e.stopPropagation();
            });
            let clickOnImage: boolean = false;
            editor.__on(editor.editor, 'mousedown', (event: MouseEvent) => {
                if ((<HTMLImageElement>event.target).tagName === 'IMG' || Dom.closest(<Node>event.target, 'table|a', editor.editor)) {
                    const target: HTMLImageElement|HTMLTableElement = (<HTMLImageElement>event.target).tagName === 'IMG' ? <HTMLImageElement>event.target :  <HTMLTableElement>Dom.closest(<Node>event.target, 'table|a', editor.editor);
                    const pos = offset(target, editor);
                    delayShowPopup(target, Math.round(pos.left + (target.offsetWidth / 2)), Math.round(pos.top + target.offsetHeight));
                    clickOnImage = true;
                } else {
                    clickOnImage = false;
                }
            });
            editor.__on(editor.ownerWindow, 'mousedown', () => {
                if (!clickOnImage) {
                    hidePopup();
                }
                clickOnImage = false;
            });
        })
        .on('beforeDestruct', () => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
            clearTimeout(timeout);
        });
};