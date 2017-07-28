/**
* Module popup edit img elements and table
* @module Popap
* @params {Object} parent Jodit main object
*/
import Jodit from "../Jodit";
import Toolbar from "../modules/Toolbar";
import {Config} from '../Config'
import {$$, css, dom, debounce, offset} from "../modules/Helpers";
import {ControlType} from "../modules/Toolbar";
declare module "../Config" {
    interface Config {
        popup: {[key: string]: ControlType[]}
    }
}
/**
 * @memberof Jodit.defaultOptions
 * @prop {object} popap module Settings {@link module:Jodit/Popap|Popap}
 * @prop {array} popap.img List of buttons to the toolbar pop-up window in the image
 * @prop {array} popap.table List of buttons to the toolbar pop-up window at the tables
 * @example
 * new Jodit('#editor', {
 *     popap: {
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
 */
Config.prototype.popup = {
    img: [
        {
            name: 'bin',
            tooltip: 'Delete',
            command: 'delete'
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
                    if (css(image, 'float') && ['right', 'left'].indexOf(css(image, 'float').toLowerCase()) !== -1) {
                        css(image, 'float', '');
                    }
                    clearCenterAlign();
                }
            },
            tooltip: 'Horizontal align'
        }
    ],
    /*table: [
        {
            name: 'brush',
            popap: function (elm, callback) {
                let $bg,
                    $cl,
                    $tab,
                    $selected = elm.find('.jodit_focused_cell'),
                    color = $selected.css('color'),
                    bg_color = $selected.css('background-color');

                $bg = this.form.buildColorPicker((value) => {
                    $selected
                        .css('background-color', value);
                    if (callback) {
                        callback();
                    }
                }, bg_color);

                $cl = this.form.buildColorPicker((value) => {
                    $selected.css('color', value);
                    if (callback) {
                        callback();
                    }
                }, color);

                $tab = this.form.buildTabs({
                    Background : $bg,
                    Text : $cl
                });

                return $tab;
            },
            tooltip: 'Background'
        },
        {
            name: 'valign',
            list: {
                top: 'Top',
                middle: 'Middle',
                bottom: 'Bottom'
            },
            tooltip: 'Vertical align'
        }, '|',
        {
            name: 'splitv',
            tooltip: 'Split vertical'
        },
        {
            name: 'splitg',
            tooltip: 'Split horizontal'
        },
        "\n",
        {
            name: 'merge',
            tooltip: 'Merge'
        },
        {
            name: 'addcolumn',
            list: {
                addcolumnbefore: 'Insert column before',
                addcolumnafter: 'Insert column after'
            },
            tooltip: 'Add column'
        },
        {
            name: 'addrow',
            list: {
                addrowbefore: 'Insert row above',
                addrowafter: 'Insert row below'
            },
            tooltip: 'Add row'
        },
        {
            name: 'bin',
            list: {
                bin: 'Delete table',
                binrow: 'Delete row',
                bincolumn: 'Delete column',
                empty: 'Empty cell'
            },
            tooltip: 'Delete'
        }
    ]*/
};

Jodit.plugins.Popup = function (editor: Jodit) {
    const toolbar: Toolbar = new Toolbar(editor),
        popap: HTMLDivElement = <HTMLDivElement> dom('<div class="jodit_toolbar_popup-inline"></div>'),

        hidePopap = () => {
            popap
                .classList.remove('active');
        },

        showPopap = (elm: HTMLElement, x: number, y: number) => {
            hidePopap();

            const tagName: string = elm.tagName.toLowerCase();

            if (editor.options.popup[tagName] === undefined) {
                return;
            }

            popap.innerHTML = '';

            toolbar.build(editor.options.popup[tagName], popap);

            popap.classList
                .add('active');

            css(popap, {
                left: x + 'px',
                top: y + 'px',
                marginLeft: -Math.round(popap.offsetWidth / 2) + 'px'
            });
        };

    /**
     * @method init
     */


    editor.container
        .appendChild(popap);

    editor.events.on('hidePopap afterCommand', hidePopap);
    editor.events.on('showPopap', showPopap);


    editor.__on(popap,'mouseup', (e: MouseEvent) => {
        e.stopPropagation();
    });
    editor.__on(window,'mouseup', hidePopap);

    const open = function (event: MouseEvent) {
        const
            elm: HTMLImageElement = <HTMLImageElement>event.target,
            pos = offset(elm);
        showPopap(elm, Math.round(pos.left + (elm.offsetWidth / 2)), Math.round(pos.top + elm.offsetHeight));
    };
    editor.__on(editor.editor, 'mousedown', (event: MouseEvent) => {
        if ((<HTMLImageElement>event.target).tagName === 'IMG') {
            editor.selection.select(<Node>event.target);
            if (editor.options.observer.timeout) {
                setTimeout(open.bind(this, event), editor.options.observer.timeout);
            } else {
                open(event);
            }
        }
    });
};