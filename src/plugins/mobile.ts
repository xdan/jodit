/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from "../Jodit";
import {Config} from '../Config'
import {ControlType} from "../modules/Toolbar";
import {Toolbar} from "../modules";
import * as consts from "../constants";

declare module "../Config" {
    interface Config {
        /**
         * Mobile timeout for CLICK emulation
         */
        mobileTapTimeout: number;
    }
}


Config.prototype.mobileTapTimeout = 300;

Config.prototype.controls.dots = <ControlType> {
    mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
    popup: (editor: Jodit, current: false | Node, control: ControlType, close: Function) => {
        let store: {
            container: HTMLDivElement,
            toolbar: Toolbar,
            rebuild: Function
        } | undefined = <any>control.data;

        if (store === undefined) {

            store = {
                container: editor.ownerDocument.createElement('div'),
                toolbar: new Toolbar(editor),
                rebuild: () => {
                    const buttons: Array<string|ControlType> | undefined = editor.events.fire('getDiffButtons.mobile');

                    if (buttons && store) {
                        store.toolbar.build(buttons, store.container);
                    }
                }
            };

            store.container.style.width = '100px';

            control.data = store;
        }

        store.rebuild();

        return store.container;
    }
};

/**
 * Rebuild toolbar in depends of editor's width
 */
export function mobile(editor: Jodit) {
    let timeout: number = 0,
        now: number,
        store: Array<string|ControlType> = editor.options.buttons;

    editor.events
        .on('touchend', (e: TouchEvent) => {
            if (e.changedTouches.length) {
                now = (new Date()).getTime();
                if (now - timeout > editor.options.mobileTapTimeout) {
                    timeout = now;
                    editor.selection.insertCursorAtPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                }
            }
        })
        .on('getDiffButtons.mobile', () => {
            return editor.options.buttons.filter((i: string|ControlType) => {
                return store.indexOf(i) < 0;
            });
        })
        .on('resize afterInit', () => {
            let width: number = editor.container.offsetWidth;

            if (width >= editor.options.sizeLG) {
                store = editor.options.buttons;
            } else if (width >= editor.options.sizeMD) {
                store = editor.options.buttonsMD;
            } else if (width >= editor.options.sizeSM) {
                store = editor.options.buttonsSM;
            } else {
                store = editor.options.buttonsXS;
            }

            editor.toolbar.build(store.concat(editor.options.extraButtons), editor.container);
        });
}