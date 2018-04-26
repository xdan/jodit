/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from "../Jodit";
import {Plugin} from "../modules/Plugin";
import {ControlType, ToolbarCollection, ToolbarPopup} from "../modules/ToolbarCollection";
import {css, offset, splitArray} from "../modules/Helpers";
import {Table} from "../modules/Table";
import {Config} from "../Config";
import {Widget} from "../modules/Widget";
import ColorPickerWidget = Widget.ColorPickerWidget;
import TabsWidget = Widget.TabsWidget;
import {Dom} from "../modules/Dom";

declare module "../Config" {
    interface Config {
        popup: {[key: string]: Array<ControlType|string>},
        toolbarInline: boolean;
        toolbarInlineDisableFor: string | string[];
    }
}

Config.prototype.toolbarInline = true;
Config.prototype.toolbarInlineDisableFor = [];

Config.prototype.popup = <{[key: string]: Array<ControlType|string>}>{
    a: [
        <ControlType>{
            name: 'eye',
            tooltip: 'Open link',
            exec: (editor: Jodit, current: Node) => {
                const href: string|null = (<HTMLElement>current).getAttribute('href');
                if (current && href) {
                    editor.ownerWindow.open(href);
                }
            }
        },
        {
            name: 'link',
            tooltip: 'Edit link',
            icon: 'pencil'
        },
        'unlink',
        'brush',
        'file',
    ],
    img: [
        {
            name: 'bin',
            tooltip: 'Delete',
            exec: (editor: Jodit, image: Node) => {
                if (image.parentNode) {
                    image.parentNode.removeChild(image);
                    editor.events.fire('hidePopup');
                }
            }
        },
        {
            name: 'pencil',
            exec: function (editor: Jodit, current: Node) {
                const tagName: string = (<HTMLElement>current).tagName.toLowerCase();
                if (tagName === 'img') {
                    editor.events.fire('openImageProperties', current);
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

                const command: string = (control.args && typeof control.args[1] === 'string') ? control.args[1].toLowerCase() : '';

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

                const command: string = (control.args && typeof control.args[1] === 'string') ? control.args[1].toLowerCase() : '';

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
            popup: (editor: Jodit, elm: HTMLTableElement) => {
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
                    editor.setEditorValue();
                    // close();
                }, bg_color);

                $cl = ColorPickerWidget(editor,(value: string) => {
                    selected.forEach((cell: HTMLTableCellElement) => {
                        css(cell, 'color', value);
                    });
                    editor.setEditorValue();
                    // close();
                }, color);

                $br = ColorPickerWidget(editor,(value: string) => {
                    selected.forEach((cell: HTMLTableCellElement) => {
                        css(cell, 'border-color', value);
                    });
                    editor.setEditorValue();
                    // close();
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

                const command: string = (control.args && typeof control.args[1] === 'string') ? control.args[1].toLowerCase() : '';

                Table.getAllSelectedCells(table).forEach((cell: HTMLTableCellElement) => {
                    css(cell, 'vertical-align', command);
                })
            },
            tooltip: 'Vertical align'
        },
        {
            name: 'splitv',
            list: {
                tablesplitv: 'Split vertical',
                tablesplitg: 'Split horizontal'
            },
            tooltip: 'Split'
        },
        {
            name: 'align',
            icon: 'left'
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
                const command: string = (control.args && typeof control.args[0] === 'string') ? control.args[0].toLowerCase() : '';

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
                const command: string = (control.args && typeof control.args[0] === 'string') ? control.args[0].toLowerCase() : '';

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
                const command: string = (control.args && typeof control.args[0] === 'string') ? control.args[0].toLowerCase() : '';

                editor.execCommand(command, false, table);
            },
            tooltip: 'Delete'
        }
    ]
};

/**
 * Support inline toolbar
 *
 * @param {Jodit} editor
 */
export class inlinePopup extends Plugin{
    private toolbar: ToolbarCollection;
    private popup: ToolbarPopup;
    private target: HTMLDivElement;
    private container: HTMLDivElement;

    constructor(jodit: Jodit) {
        super(jodit);
        this.toolbar = new ToolbarCollection(jodit);
        this.target = jodit.ownerDocument.createElement('div');
        this.container = jodit.ownerDocument.createElement('div');
        this.target.classList.add('jodit_toolbar_popup-inline-target');
        this.popup = new ToolbarPopup(jodit, this.target, void(0), 'jodit_toolbar_popup-inline');
    }

    isShown: boolean = false;

    private calcPosition = (rect: Bound) => {
        const win: Window = this.jodit.ownerWindow;
        const docElement: HTMLElement = this.jodit.ownerDocument.documentElement;
        const body: HTMLElement = this.jodit.ownerDocument.body;
        const scrollTop: number = win.pageYOffset || docElement.scrollTop || body.scrollTop;
        const clientTop: number = docElement.clientTop || body.clientTop || 0;
        const scrollLeft: number = win.pageXOffset || docElement.scrollLeft || body.scrollLeft;
        const clientLeft: number = docElement.clientLeft || body.clientLeft || 0;

        this.target.style.left = (rect.left + rect.width / 2) + 'px';
        this.target.style.top = (rect.top + rect.height + 10) + 'px';

        if (this.jodit.isFullSize()) {
            this.target.style.zIndex = css(this.jodit.container, 'zIndex').toString();
        }

        this.container.style.marginLeft = (-this.container.offsetWidth/2) + 'px';
        this.popup.container.classList.remove('jodit_toolbar_popup-inline-top');

        if (rect.top + rect.height + 10 + this.container.offsetHeight > this.jodit.ownerWindow.innerHeight + scrollTop - clientTop) {
            this.target.style.top = (rect.top - this.container.offsetHeight - 10) + 'px';
            this.popup.container.classList.add('jodit_toolbar_popup-inline-top');
        }
        if ((rect.left + rect.width / 2) - this.container.offsetWidth/2 < 0) {
            this.container.style.marginLeft = (-rect.width / 2) + 'px';
        }
        if ((rect.left + rect.width / 2) + this.container.offsetWidth/2 > this.jodit.ownerWindow.innerWidth + scrollLeft - clientLeft) {
            this.container.style.marginLeft = (-rect.width / 2) + 'px';
        }
    };

    private isExcludedTarget(type: string): boolean {
        return splitArray(this.jodit.options.toolbarInlineDisableFor)
            .map(a => a.toLowerCase())
            .indexOf(type.toLowerCase()) !== -1
    }

    private showPopup = (rect: () => Bound, type: string, elm?: HTMLElement): boolean => {
        if (
            !this.jodit.options.toolbarInline ||
            !this.jodit.options.popup[type.toLowerCase()]
        ) {
            return false;
        }

        if (this.isExcludedTarget(type)) {
            return true;
        }

        this.isShown = true;
        this.isTargetAction = true;

        this.target.parentNode || this.jodit.ownerDocument.body.appendChild(this.target);

        this.toolbar.build(this.jodit.options.popup[type.toLowerCase()], this.container, elm);


        this.popup.open(this.container, false, true);

        this.calcPosition(rect());

        return true;
    };

    private hidePopup = (root?: HTMLElement) => {
        if (root && Dom.isOrContains(this.target, root instanceof ToolbarPopup ? root.target : root)) {
            return;
        }

        this.isShown = false;
        this.popup.close();
        this.target.parentNode && this.target.parentNode.removeChild(this.target);
    };

    private isSelectionStarted = false;

    private onSelectionEnd = () => {
        if (!this.jodit.isEditorMode()) {
            return;
        }

        if (this.isSelectionStarted && !this.isTargetAction) {
            this.isSelectionStarted = false;
            this.onChangeSelection();
        }
    };

    private isTargetAction: boolean = false;
    private isSelectionPopup: boolean = false;

    private onSelectionStart = (event: MouseEvent) => {
        if (!this.jodit.isEditorMode()) {
            return;
        }

        this.isTargetAction = false;
        this.isSelectionPopup = false;

        if (!this.isSelectionStarted) {
            const elements: string = Object.keys(this.jodit.options.popup).join('|');
            const target: HTMLElement | false = (<Node>event.target).nodeName === 'IMG' ? <HTMLImageElement>event.target :  <HTMLTableElement>Dom.closest(<Node>event.target, elements, this.jodit.editor);

            if (!target || !this.showPopup(() => offset(target, this.jodit, this.jodit.editorDocument), target.nodeName, target)) {
                this.isSelectionStarted = true;
            }
        }
    };

    onChangeSelection = () => {
        if (!this.jodit.options.toolbarInline || !this.jodit.isEditorMode()) {
            return;
        }
        if (this.jodit.options.popup.selection !== undefined) {
            if (!this.jodit.selection.isCollapsed()) {
                this.isSelectionPopup = true;
                const sel: Selection = this.jodit.editorWindow.getSelection();
                if (sel.rangeCount) {
                    const range: Range = sel.getRangeAt(0);
                    this.showPopup(() => offset(range, this.jodit, this.jodit.editorDocument), 'selection');
                }
            } else {
                this.hidePopup();
            }
        }
    };

    private checkIsTargetEvent = () => {
        if (!this.isTargetAction){
            this.hidePopup();
        } else {
            this.isTargetAction = false;
        }
    };

    afterInit(editor: Jodit) {
        editor.events
            .on(this.target,'mousedown keydown touchstart', (e: MouseEvent) => {
                e.stopPropagation();
            })
            .on('beforeOpenPopup hidePopup', this.hidePopup)
            .on('getDiffButtons.mobile', (_toolbar: ToolbarCollection) : void | string[] => {
                if (this.toolbar === _toolbar) {
                    return splitArray(editor.options.buttons)
                        .filter(name => name !=='|' && name !== '\n')
                        .filter((name: string) => {
                            return this.toolbar.getButtonsList().indexOf(name) < 0;
                        });
                }
            })
            .on('selectionchange', this.onChangeSelection)
            .on('afterCommand resize afterExec', () => {
                if (this.isShown && this.isSelectionPopup) {
                    this.onChangeSelection();
                }
            })
            .on('showPopup', (elm: HTMLElement | string, rect: () => Bound) => {
                const elementName: string = (typeof elm === 'string' ? elm : elm.nodeName).toLowerCase();

                this.showPopup(rect, elementName, typeof elm === 'string' ? void(0) : elm);

            })

            .on('mousedown keydown touchstart', this.onSelectionStart)
            .on([editor.ownerWindow], 'scroll', this.hidePopup)
            .on([editor.ownerWindow],'mouseup keyup touchend', this.onSelectionEnd)
            .on([editor.ownerWindow],'mousedown keydown touchstart', this.checkIsTargetEvent)

    }
    beforeDestruct(editor: Jodit) {
        this.popup.destruct();
        this.toolbar.destruct();
        this.target.parentNode && this.target.parentNode.removeChild(this.target);

        editor.events
            .off([editor.ownerWindow], 'scroll', this.hidePopup)
            .off([editor.ownerWindow],'mouseup keyup touchend', this.onSelectionEnd)
            .off([editor.ownerWindow],'mousedown keydown touchstart', this.checkIsTargetEvent);

        super.destruct();
    }
}