/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config'
import {css, dom} from "../modules/Helpers";
import {Toolbar} from "../modules/Toolbar";
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
 * editor.events.fire('toggleFullsize');
 * editor.events.fire('toggleFullsize', [true]); // fullsize
 * editor.events.fire('toggleFullsize', [false]); // usual mode
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
Config.prototype.controls.fullsize = {
    exec: (editor: Jodit) => {
        editor.events.fire('toggleFullsize');
    },
    tooltip: 'Open editor in fullsize',
    mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG
};


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

            shown = condition;

            editor.container.classList.toggle('jodit_fullsize', condition);

            if (editor.toolbar) {
                css(editor.toolbar.container, 'width', 'auto');
                const icon: HTMLElement = dom(<string>Toolbar.getIcon(condition ? 'shrink' : 'fullsize'), editor.ownerDocument),
                    a: HTMLAnchorElement|null = editor.toolbar.container.querySelector('.jodit_toolbar_btn-fullsize a');

                if (a) {
                    icon.classList.add('jodit_icon');
                    a.innerHTML = '';
                    a.appendChild(icon);
                }
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

    if (editor.options.fullsize) {
        editor.events.on('afterInit', () => {
            toggle(true);
        });
    }

    if (editor.options.globalFullsize) {
        editor.__on(editor.ownerWindow, 'resize', resize);
    }

    editor.events.on('toggleFullsize', toggle);
    editor.events.on('beforeDestruct', () => {
        toggle(false);
    });
}
