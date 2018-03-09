/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from "../Jodit";
import {Config} from '../Config'
import {ControlType, ToolbarButton} from "../modules/ToolbarCollection";
import {ToolbarCollection} from "../modules/ToolbarCollection";
import * as consts from "../constants";
import {splitArray} from "../modules/Helpers";

declare module "../Config" {
    interface Config {
        /**
         * Mobile timeout for CLICK emulation
         */
        mobileTapTimeout: number;
        toolbarAdaptive: boolean;
    }
}


Config.prototype.mobileTapTimeout = 300;

/**
 * After resize it will change buttons set for different sizes
 *
 * @type {boolean}
 */
Config.prototype.toolbarAdaptive = true;

Config.prototype.controls.dots = <ControlType> {
    mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
    popup: (editor: Jodit, current: false | Node, control: ControlType, close, button: ToolbarButton) => {
        let store: {
            container: HTMLDivElement,
            toolbar: ToolbarCollection,
            rebuild: Function
        } | undefined = <any>control.data;

        if (store === undefined) {

            store = {
                container: editor.ownerDocument.createElement('div'),
                toolbar: new ToolbarCollection(editor),
                rebuild: () => {
                    const buttons: Array<string|ControlType> | undefined = editor.events.fire('getDiffButtons.mobile', button.parentToolbar);

                    if (buttons && store) {
                        store.toolbar.build(splitArray(buttons), store.container);
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
        store: Array<string|ControlType> = splitArray(editor.options.buttons);

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
        .on('getDiffButtons.mobile', (toolbar: ToolbarCollection) : void | string[] => {
            if (toolbar === editor.toolbar) {
                return splitArray(editor.options.buttons).filter((i: string|ControlType) => {
                    return store.indexOf(i) < 0;
                });
            }
        });

    if (editor.options.toolbarAdaptive) {
        editor.events.on('resize afterInit', () => {
            if (!editor.options.toolbar) {
                return;
            }

            let width: number = editor.container.offsetWidth;
            let newStore: Array<string|ControlType> = [];
            if (width >= editor.options.sizeLG) {
                newStore = splitArray(editor.options.buttons);
            } else if (width >= editor.options.sizeMD) {
                newStore = splitArray(editor.options.buttonsMD);
            } else if (width >= editor.options.sizeSM) {
                newStore = splitArray(editor.options.buttonsSM);
            } else {
                newStore = splitArray(editor.options.buttonsXS);
            }

            if (newStore.toString() !== store.toString()) {
                store = newStore;
                editor.toolbar.build(store.concat(editor.options.extraButtons), editor.container);
            }
        });
    }
}