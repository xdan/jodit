/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config'
import {css} from "../modules/Helpers";
import {ControlType, ToolbarButton, ToolbarIcon} from "../modules/ToolbarCollection";
import * as consts from '../constants'

/**
 * Fullsize plugin
 *
 * @module Fullsize
 */

/**
 * @property{boolean} fullsize=false true Editor toWYSIWYG open toWYSIWYG full screen
 * @property{boolean} globalFullsize=true if true, after `fullsize` -  all editors element get jodit_fullsize_box class (z-index: 100000 !important;)
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

declare module "../Config" {
    interface Config {
        fullsize: boolean;
        globalFullsize: boolean;
    }
}

Config.prototype.fullsize = false;
Config.prototype.globalFullsize = true;
Config.prototype.controls.fullsize = <ControlType>{
    exec: (editor: Jodit) => {
        editor.toggleFullSize();
    },
    isActive: (editor: Jodit) => editor.isFullSize(),
    getLabel: (editor: Jodit, btn: ControlType, button: ToolbarButton) => {
        const mode: string = editor.isFullSize() ? 'shrink' : 'fullsize';

        button.textBox.innerHTML = !editor.options.textIcons ? ToolbarIcon.getIcon(mode) : `<span>${editor.i18n(mode)}</span>`;

        (<HTMLElement>button.textBox.firstChild).classList.add('jodit_icon');
    },
    tooltip: 'Open editor in fullsize',
    mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
};

/**
 * Process `toggleFullSize` event, and behavior - set/unset fullsize mode
 *
 * @param {Jodit} editor
 */
export  function fullsize(editor: Jodit) {
    let shown: boolean = false,
        oldHeight: number = 0,
        oldWidth: number = 0,
        wasToggled = false,
        resize  = () => {
            if (editor.events) {
                if (shown) {
                    oldHeight = <number>css(editor.container, 'height');
                    oldWidth = <number>css(editor.container, 'width');
                    css(editor.container, {
                        height: editor.ownerWindow.innerHeight,
                        width: editor.ownerWindow.innerWidth
                    });
                    wasToggled = true;
                } else if (wasToggled) {
                    css(editor.container, {
                        height: oldHeight || 'auto',
                        width: oldWidth || 'auto'
                    });
                }
            }
        },
        toggle = (condition?: boolean) => {
            if (condition === undefined) {
                condition = !editor.container.classList.contains('jodit_fullsize');
            }

            editor.options.fullsize = !!condition;

            shown = condition;

            editor.container.classList.toggle('jodit_fullsize', condition);

            if (editor.toolbar) {
                css(editor.toolbar.container, 'width', 'auto');
            }

            if (editor.options.globalFullsize) {
                let node = <HTMLElement>editor.container.parentNode;
                while (node && !(node instanceof Document)) {
                    node.classList.toggle('jodit_fullsize_box', condition);
                    node = <HTMLElement>node.parentNode;
                }
                resize();
            }

            editor.events.fire('afterResize');
        };

    if (editor.options.globalFullsize) {
        editor.events.on(editor.ownerWindow, 'resize', resize);
    }

    editor.events
        .on('afterInit', () => {
            editor.toggleFullSize(editor.options.fullsize);
        })
        .on('toggleFullSize', toggle)
        .on('beforeDestruct', () => {
            toggle(false);
        });
}
