/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import { INVISIBLE_SPACE, MODE_WYSIWYG } from '../constants';
import { ContextMenu } from '../modules/ContextMenu';
import { Dom } from '../modules/Dom';
import { debounce, dom, getXPathByElement } from '../modules/helpers/Helpers';
import { Plugin } from '../modules/Plugin';
import { ToolbarButton } from '../modules/toolbar/button';
import { IControlType } from '../types/toolbar';

declare module '../Config' {
    interface Config {
        showXPathInStatusbar: boolean;
    }
}

Config.prototype.controls.selectall = {
    icon: 'select-all',
    command: 'selectall',
    tooltip: 'Select all',
} as IControlType;

Config.prototype.showXPathInStatusbar = true;

/**
 * Show path to current element in status bar
 */
export class xpath extends Plugin {
    private calcPath: () => void;
    private onContext = (bindElement: Node, event: MouseEvent) => {
        if (!this.menu) {
            this.menu = new ContextMenu(this.jodit);
        }

        this.menu.show(event.clientX, event.clientY, [
            {
                icon: 'bin',
                title: bindElement === this.jodit.editor ? 'Clear' : 'Remove',
                exec: () => {
                    if (bindElement !== this.jodit.editor) {
                        bindElement.parentNode &&
                            bindElement.parentNode.removeChild(bindElement);
                    } else {
                        this.jodit.value = '';
                    }
                    this.jodit.setEditorValue();
                },
            },
            {
                icon: 'select-all',
                title: 'Select',
                exec: () => {
                    this.jodit.selection.select(bindElement);
                },
            },
        ]);
        return false;
    };
    private onSelectPath = (bindElement: Node, event: MouseEvent) => {
        this.jodit.selection.focus();

        const path: string =
            (event.target as HTMLElement).getAttribute('data-path') || '/';

        if (path === '/') {
            this.jodit.execCommand('selectall');
            return false;
        }

        try {
            const elm: Node | null = this.jodit.editorDocument
                .evaluate(
                    path,
                    this.jodit.editor,
                    null,
                    XPathResult.ANY_TYPE,
                    null
                )
                .iterateNext();

            if (elm) {
                this.jodit.selection.select(elm);
                return false;
            }
        } catch {}

        this.jodit.selection.select(bindElement);

        return false;
    };
    private tpl = (
        bindElement: Node,
        path: string,
        name: string,
        title: string
    ): HTMLElement => {
        const li: HTMLLIElement = dom(
            `<li>
                <a
                    role="button"
                    data-path="${path}"
                    href="javascript:void(0)"
                    title="${title}"
                    tabindex="-1"
                >
                    ${name}
                </a>
            </li>`,
            this.jodit.ownerDocument
        ) as HTMLLIElement;

        const a: HTMLAnchorElement = li.firstChild as HTMLAnchorElement;

        this.jodit.events
            .on(a, 'click', this.onSelectPath.bind(this, bindElement))
            .on(a, 'contextmenu', this.onContext.bind(this, bindElement));

        return li;
    };

    private appendSelectAll = () => {
        const li: ToolbarButton = new ToolbarButton(this.jodit, {
            name: 'selectall',
            ...this.jodit.options.controls.selectall,
            tooltip: '',
        });

        this.container.insertBefore(li.container, this.container.firstChild);
    };
    private calcPathImd = () => {
        const current: Node | false = this.jodit.selection.current();

        let index: number = 0;

        this.container.innerHTML = INVISIBLE_SPACE;

        if (current) {
            let name: string, xpth: string, li: HTMLElement;

            Dom.up(
                current,
                (elm: Node) => {
                    if (
                        this.jodit.editor !== elm &&
                        elm.nodeType !== Node.TEXT_NODE
                    ) {
                        name = elm.nodeName.toLowerCase();
                        xpth = getXPathByElement(
                            elm as HTMLElement,
                            this.jodit.editor
                        ).replace(/^\//, '');
                        li = this.tpl(
                            elm,
                            xpth,
                            name,
                            this.jodit.i18n('Select %s', name)
                        );

                        this.container.insertBefore(
                            li,
                            this.container.firstChild
                        );
                    }
                    index += 1;
                },
                this.jodit.editor
            );
        }

        this.appendSelectAll();
    };

    public container: HTMLElement;
    public menu: ContextMenu;

    public afterInit() {
        if (this.jodit.options.showXPathInStatusbar) {
            this.calcPath = debounce(
                this.calcPathImd,
                this.jodit.defaultTimeout * 2
            );
            this.container = this.jodit.ownerDocument.createElement('ul');
            this.container.classList.add('jodit_xpath');
            this.jodit.statusbar.append(this.container);
            this.jodit.events
                .on('mouseup change keydown changeSelection', this.calcPath)
                .on('afterSetMode afterInit', () => {
                    if (this.jodit.getRealMode() === MODE_WYSIWYG) {
                        this.calcPath();
                    } else {
                        this.container.innerHTML = INVISIBLE_SPACE;
                        this.appendSelectAll();
                    }
                });
            this.calcPath();
        }
    }
}
