/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { Jodit } from '../Jodit';
import { splitArray } from '../modules/Helpers';
import { ToolbarButton } from '../modules/toolbar/button';
import { ToolbarCollection } from '../modules/toolbar/collection';
import { IControlType } from '../types/toolbar';

declare module '../Config' {
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

Config.prototype.controls.dots = {
    mode: consts.MODE_SOURCE + consts.MODE_WYSIWYG,
    popup: (
        editor: Jodit,
        current: false | Node,
        control: IControlType,
        close,
        button: ToolbarButton
    ) => {
        let store:
            | {
                  container: HTMLDivElement;
                  toolbar: ToolbarCollection;
                  rebuild: () => void;
              }
            | undefined = control.data as any;

        if (store === undefined) {
            store = {
                container: editor.ownerDocument.createElement('div'),
                toolbar: new ToolbarCollection(editor),
                rebuild: () => {
                    const buttons:
                        | Array<string | IControlType>
                        | undefined = editor.events.fire(
                        'getDiffButtons.mobile',
                        button.parentToolbar
                    );

                    if (buttons && store) {
                        store.toolbar.build(
                            splitArray(buttons),
                            store.container
                        );
                    }
                },
            };

            store.container.style.width = '100px';

            control.data = store;
        }

        store.rebuild();

        return store.container;
    },
} as IControlType;

/**
 * Rebuild toolbar in depends of editor's width
 */
export function mobile(editor: Jodit) {
    let timeout: number = 0,
        now: number,
        store: Array<string | IControlType> = splitArray(
            editor.options.buttons
        );

    editor.events
        .on('touchend', (e: TouchEvent) => {
            if (e.changedTouches && e.changedTouches.length) {
                now = new Date().getTime();
                if (now - timeout > editor.options.mobileTapTimeout) {
                    timeout = now;
                    editor.selection.insertCursorAtPoint(
                        e.changedTouches[0].clientX,
                        e.changedTouches[0].clientY
                    );
                }
            }
        })
        .on(
            'getDiffButtons.mobile',
            (toolbar: ToolbarCollection): void | string[] => {
                if (toolbar === editor.toolbar) {
                    return splitArray(editor.options.buttons).filter(
                        (i: string | IControlType) => {
                            return store.indexOf(i) < 0;
                        }
                    );
                }
            }
        );

    if (editor.options.toolbarAdaptive) {
        editor.events.on('resize afterInit', () => {
            if (!editor.options.toolbar) {
                return;
            }

            const width: number = editor.container.offsetWidth;

            let newStore: Array<string | IControlType> = [];

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
                editor.toolbar.build(
                    store.concat(editor.options.extraButtons),
                    editor.container
                );
            }
        });
    }
}
