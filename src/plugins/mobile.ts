import Jodit from "../Jodit";
import {Config} from '../Config'
import {ControlType} from "../modules/Toolbar";

declare module "../Config" {
    interface Config {
        /**
         * Mobile timeout for CLICK emulation
         */
        mobileTapTimeout: number;
    }
}


Config.prototype.mobileTapTimeout = 300;

/**
 * Rebuild toolbar in depends of editor's width
 */
export default function (editor: Jodit) {
    let timeout: number = 0,
        now: number;

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
        .on('resize afterInit', () => {
            let width: number = editor.container.offsetWidth,
                store: Array<string|ControlType>;

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