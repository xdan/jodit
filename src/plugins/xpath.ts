/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Config} from "../Config";
import {Plugin} from "../modules/Plugin";
import {debounce, throttle} from "../modules/Helpers";
import {Dom} from "../modules/Dom";
import {ControlType, ToolbarIcon} from "../modules/ToolbarCollection";

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
    private onSelectPath = (e: MouseEvent) => {
        const current: Node | false = this.jodit.selection.current();

        const index: number = parseInt((<HTMLElement>e.target).getAttribute('data-index') || '0', 10) || 0;
        let i: number = 0;

        if (index === -1) {
            this.jodit.execCommand('selectall');
            return false;
        }

        if (current) {
            Dom.up(current, (elm: Node): void | boolean => {
                console.log(elm);
                if (i === index) {
                    this.jodit.selection.select(elm);
                    this.jodit.selection.focus();
                    return true;
                }
                i += 1;
            }, this.jodit.editor);
        }

        return false;
    };


    private  calcPath = debounce(() => {
        const tpl = (index: number, name: string, title: string): string => `<li><a role="button" data-index="${index}" href="javascript:void(0)" title="${title}" tabindex="-1">${name}</a></li>`;
        const current: Node | false = this.jodit.selection.current();

        const path: string[] = [];
        let index: number = 0;

        if (current) {
            Dom.up(current, (elm: Node) => {
                if (this.jodit.editor !== elm && elm.nodeType !== Node.TEXT_NODE) {
                    const name: string = elm.nodeName.toLowerCase();
                    path.unshift(tpl(index, name, this.jodit.i18n('Select %s', name)));
                }
                index += 1;
            }, this.jodit.editor);
        }

        path.unshift(tpl(-1, ToolbarIcon.getIcon('select-all'), this.jodit.i18n('Select all')));

        this.container.innerHTML = path.join('');

    }, this.jodit.options.observer.timeout / 10);

    afterInit() {
        if (this.jodit.options.showXPathInStatusbar) {
            this.container = this.jodit.ownerDocument.createElement('ul');
            this.container.classList.add('jodit_xpath');
            this.jodit.statusbar.append(this.container);
            this.jodit.events
                .on('mousedown touchstart change keydown changeSelection', this.calcPath)
                .on(this.container,'click', this.onSelectPath, 'a');
            this.calcPath();
        }
    }
}