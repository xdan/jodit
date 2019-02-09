/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { css } from '../modules/helpers/';
import { ToolbarIcon } from '../modules/toolbar/icon';
import { IControlType } from '../types/toolbar';
import { IJodit, IViewWithToolbar } from '../types';

/**
 * Fullsize plugin
 *
 * @module Fullsize
 */

/**
 * @property{boolean} fullsize=false true Editor toWYSIWYG open toWYSIWYG full screen
 * @property{boolean} globalFullsize=true if true, after `fullsize` -  all editors element
 * get jodit_fullsize_box class (z-index: 100000 !important;)
 * @example
 * ```javascript
 * var editor = new jodit({
 *     fullsize: true // fullsize editor
 * });
 * ```
 * @example
 * ```javascript
 * var editor = new Jodit();
 * editor.events.fire('toggleFullSize');
 * editor.events.fire('toggleFullSize', true); // fullsize
 * editor.events.fire('toggleFullSize', false); // usual mode
 * ```
 */

declare module '../Config' {
    interface Config {
        fullsize: boolean;
        globalFullsize: boolean;
    }
}

Config.prototype.fullsize = false;
Config.prototype.globalFullsize = true;
Config.prototype.controls.fullsize = {
    exec: (editor: IJodit) => {
        editor.toggleFullSize();
    },
    isActive: (editor: IJodit) => editor.isFullSize(),
    getLabel: (editor: IJodit, btn, button) => {
        const mode: string = editor.isFullSize() ? 'shrink' : 'fullsize';

        if (button) {
            button.textBox.innerHTML = !editor.options.textIcons
                ? ToolbarIcon.getIcon(mode)
                : `<span>${editor.i18n(mode)}</span>`;
            (button.textBox.firstChild as HTMLElement).classList.add(
                'jodit_icon'
            );
        }
    },
    tooltip: 'Open editor in fullsize',
    mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
} as IControlType;

/**
 * Process `toggleFullSize` event, and behavior - set/unset fullsize mode
 *
 * @param {Jodit} editor
 */
export function fullsize(editor: IViewWithToolbar) {
    let shown: boolean = false,
        oldHeight: number = 0,
        oldWidth: number = 0,
        wasToggled = false;

    const resize = () => {
            if (editor.events) {
                if (shown) {
                    oldHeight = css(editor.container, 'height') as number;
                    oldWidth = css(editor.container, 'width') as number;
                    css(editor.container, {
                        height: editor.ownerWindow.innerHeight,
                        width: editor.ownerWindow.innerWidth,
                    });
                    wasToggled = true;
                } else if (wasToggled) {
                    css(editor.container, {
                        height: oldHeight || 'auto',
                        width: oldWidth || 'auto',
                    });
                }
            }
        },
        toggle = (condition?: boolean) => {
            if (!editor.container) {
                return;
            }

            if (condition === undefined) {
                condition = !editor.container.classList.contains(
                    'jodit_fullsize'
                );
            }

            editor.options.fullsize = !!condition;

            shown = condition;

            editor.container.classList.toggle('jodit_fullsize', condition);

            if (editor.toolbar) {
                css(editor.toolbar.container, 'width', 'auto');
            }

            if (editor.options.globalFullsize) {
                let node = editor.container.parentNode as HTMLElement;
                while (node && !(node instanceof Document)) {
                    node.classList.toggle('jodit_fullsize_box', condition);
                    node = node.parentNode as HTMLElement;
                }
                resize();
            }

            editor.events.fire('afterResize');
        };

    if (editor.options.globalFullsize) {
        editor.events.on(editor.ownerWindow, 'resize', resize);
    }

    editor.events
        .on('afterInit afterOpen', () => {
            editor.toggleFullSize(editor.options.fullsize);
        })
        .on('toggleFullSize', toggle)
        .on('beforeDestruct beforeClose', () => {
            toggle(false);
        })
        .on('beforeDestruct', () => {
            editor.events && editor.events.off(editor.ownerWindow, 'resize', resize);
        });
}
