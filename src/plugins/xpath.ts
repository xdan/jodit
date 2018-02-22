/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Config} from "../Config";
import {Plugin} from "../modules/Plugin";
import {debounce, dom, getXPathByElement, throttle} from "../modules/Helpers";
import {Dom} from "../modules/Dom";
import {ControlType, ToolbarIcon} from "../modules/ToolbarCollection";
import {INVISIBLE_SPACE, MODE_WYSIWYG} from "../constants";
import {ContextMenu} from "../modules/ContextMenu";

declare module "../Config" {
    interface Config {
        showXPathInStatusbar: boolean,
    }
}

Config.prototype.controls.selectall = <ControlType>{
    icon: 'select-all',
    command: 'selectall',
    tooltip: 'Select all'
};

Config.prototype.showXPathInStatusbar = true;

export class xpath extends Plugin{
    container: HTMLElement;
    menu: ContextMenu;

    private onContext = (bindElement: Node, event: MouseEvent) => {
        this.menu.show(event.clientX, event.clientY, [
            {
                icon: 'bin',
                title: 'Remove',
                exec: () => {
                    if (bindElement !== this.jodit.editor) {
                        bindElement.parentNode && bindElement.parentNode.removeChild(bindElement);
                    } else {
                        this.jodit.value = '';
                    }
                }
            },
            {
                icon: 'select-all',
                title: 'Select',
                exec: () => {
                    this.jodit.selection.select(bindElement);
                }
            }
        ]);
        return false;
    };
    private onSelectPath = (bindElement: Node, event: MouseEvent) => {
        this.jodit.selection.focus();

        const path: string = (<HTMLElement>event.target).getAttribute('data-path') || '/';

        let i: number = 0;

        if (path === '/') {
            this.jodit.execCommand('selectall');
            return false;
        }

        try {
            const elm : Node | null = this.jodit.editorDocument.evaluate(path, this.jodit.editor, null,   XPathResult.ANY_TYPE, null).iterateNext();

            if (elm) {
                this.jodit.selection.select(elm);
                return false;
            }

        } catch (e) {

        }

        this.jodit.selection.select(bindElement);

        return false;
    };

    private tpl = (bindElement: Node, path: string, name: string, title: string): HTMLElement => {
        const li: HTMLLIElement = <HTMLLIElement>dom(`<li><a role="button" data-path="${path}" href="javascript:void(0)" title="${title}" tabindex="-1">${name}</a></li>`, this.jodit.ownerDocument);
        const a : HTMLAnchorElement = <HTMLAnchorElement>li.firstChild;

        this.jodit.events
            .on(a, 'click', this.onSelectPath.bind(this, bindElement))
            .on(a, 'contextmenu', this.onContext.bind(this, bindElement))

        return li;
    };
    private  appendSelectAll = () => {
        const li: HTMLElement = this.tpl(this.jodit.editor, '/', this.jodit.options.textIcons ? this.jodit.i18n('Select all') : ToolbarIcon.getIcon('select-all'), this.jodit.i18n('Select all'));

        this.container.insertBefore(li, this.container.firstChild);
    };
    private  calcPathImd = () => {

        const current: Node | false = this.jodit.selection.current();

        let index: number = 0;

        if (current) {
            this.container.innerHTML = INVISIBLE_SPACE;
            Dom.up(current, (elm: Node) => {
                if (this.jodit.editor !== elm && elm.nodeType !== Node.TEXT_NODE) {
                    const name: string = elm.nodeName.toLowerCase(),
                         xpath: string = getXPathByElement(<HTMLElement>elm, this.jodit.editor).replace(/^\//, '');

                    const li: HTMLElement = this.tpl(elm, xpath, name, this.jodit.i18n('Select %s', name));

                    this.container.insertBefore(li, this.container.firstChild)
                }
                index += 1;
            }, this.jodit.editor);

            this.appendSelectAll();
        }



    };

    private  calcPath = debounce(this.calcPathImd, this.jodit.options.observer.timeout * 2);


    afterInit() {
        if (this.jodit.options.showXPathInStatusbar) {
            this.menu = new ContextMenu(this.jodit);
            this.container = this.jodit.ownerDocument.createElement('ul');
            this.container.classList.add('jodit_xpath');
            this.jodit.statusbar.append(this.container);
            this.jodit.events
                .on('mouseup change keydown changeSelection', this.calcPath)
                .on('afterSetMode', () => {
                    if (this.jodit.getRealMode() === MODE_WYSIWYG) {
                        this.calcPath()
                    } else {
                        this.container.innerHTML = INVISIBLE_SPACE;
                        this.appendSelectAll();
                    }
                });
            this.calcPath();
        }
    }
}